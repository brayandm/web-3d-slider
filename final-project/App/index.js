import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    MathUtils,
    Clock,
    Raycaster,
    Vector2,
    DoubleSide,
    Mesh,
    ShaderMaterial,
    PlaneGeometry,
    AmbientLight,
    SpotLight,
    SpotLightHelper,
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    Color,
    Vector3,
    ACESFilmicToneMapping,
    sRGBEncoding,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import Slider from "./Slider";
import resources from "./Resources";
import Composer from "./Postprocessing";

import backgroundVertexShader from "./Shaders/Background/index.vert";
import backgroundFragmentShader from "./Shaders/Background/index.frag";
import fairyFliesVertexShader from "./Shaders/FairyFlies/index.vert";
import fairyFliesFragmentShader from "./Shaders/FairyFlies/index.frag";
import { damp } from "maath/easing";

export default class App {
    constructor(config, onLoaded = () => {}) {
        this._config = config;
        this._onLoaded = onLoaded;
        this._gl = undefined;
        this._composer = undefined;
        this._camera = undefined;
        this._scene = undefined;
        this._controls = undefined;
        this._deltaTimeComposer = 0;
        this._raf = undefined;
        this._raycaster = new Raycaster();
        this._mouse = new Vector2();
        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);

        this._init();
    }

    async _init() {
        // RESOURCES
        await resources.load();

        // GL
        this._gl = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
            antialias: window.devicePixelRatio <= 1,
            stencil: true,
            depth: true,
        });
        if (window.devicePixelRatio > 1) {
            this._gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        // TONE MAPPING
        this._gl.toneMapping = ACESFilmicToneMapping;
        this._gl.toneMappingExposure = 1;

        // COLOR SPACE
        this._gl.outputEncoding = sRGBEncoding;

        // CAMERA
        const aspect = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
        this._camera.position.z = 100;

        // CLOCK
        this._clock = new Clock();

        // SCENE
        this._scene = new Scene();

        // SPOT LIGHT
        const spotLight = new SpotLight(0xffffff, 1);
        spotLight.position.set(0, 0, 500);
        spotLight.penumbra = 0.5;
        spotLight.decay = 2;
        spotLight.distance = 2000;
        this._light = spotLight;
        this._scene.add(this._light);

        // LIGHT HELPER
        const lightHelper = new SpotLightHelper(spotLight);
        lightHelper.visible = this._config.lightHelper;
        this._lightHelper = lightHelper;
        this._scene.add(this._lightHelper);

        // AMBIENT LIGHT
        const ambientLight = new AmbientLight(0xffffff, 0.1);
        this._ambientLight = ambientLight;
        this._scene.add(this._ambientLight);

        // COMPOSER
        this._composer = new Composer({
            renderer: this._gl,
            scene: this._scene,
            camera: this._camera,
        });

        // CONTROLS
        this._controls = new OrbitControls(this._camera, this._gl.domElement);
        this._controls.enabled = false;

        // START
        this._initEvents();
        this._initScene();
        this._initFairyFlies();

        // RESIZE RENDERER AND CAMERA
        this._resize();

        // ON LOADED
        this._onLoaded();

        // START
        this._start();
    }

    _initFairyFlies() {
        const material = new ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uVelocity: { value: this._config.fairyFliesVelocity },
                uPointSize: { value: this._config.fairyFliesSize },
            },
            vertexShader: fairyFliesVertexShader,
            fragmentShader: fairyFliesFragmentShader,
            vertexColors: true,
        });

        const particles = 200;
        const geometry = new BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particles; i++) {
            positions.push(
                (this._slider.getMaxX() - this._slider.getMinX() + 2000) *
                    Math.random() +
                    this._slider.getMinX() -
                    1000
            );
            positions.push((Math.random() - 0.5) * window.innerHeight * 1.5);
            positions.push((Math.random() - 0.5) * 50);

            const fairyColors = [
                0x4caf50, 0x2196f3, 0xffeb3b, 0xff5722, 0x9c27b0,
            ];

            const color =
                fairyColors[Math.floor(Math.random() * fairyColors.length)];

            colors.push(((color >> 16) & 255) / 255);
            colors.push(((color >> 8) & 255) / 255);
            colors.push((color & 255) / 255);
        }

        geometry.setAttribute(
            "position",
            new Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

        this._fairyFlies = new Points(geometry, material);
        this._fairyFlies.userData.initialPosition =
            this._fairyFlies.position.clone();
        this._fairyFlies.userData.destinationPosition =
            this._fairyFlies.position.clone();
        this._fairyFlies.userData.dragPosition =
            this._fairyFlies.position.clone();
        this._fairyFlies.userData.dragPosition.z += MathUtils.randFloat(
            -50,
            -30
        );
        this._scene.add(this._fairyFlies);
    }

    _initScene() {
        this._slider = new Slider();
        this._scene.add(this._slider);

        const geometry = new PlaneGeometry(
            window.innerWidth * 2.5,
            window.innerHeight * 2.5
        );

        this._initialWidth = window.innerWidth;
        this._initialHeight = window.innerHeight;

        const material = new ShaderMaterial({
            uniforms: {
                time: { type: "f", value: 0 },
                uMouse: { type: "v2", value: new Vector2() },
                resolution: {
                    type: "v2",
                    value: new Vector2(window.innerWidth, window.innerHeight),
                },
                velocity: {
                    type: "f",
                    value: this._config.backgroundStarsVelocity,
                },
                spread: {
                    type: "f",
                    value: this._config.backgroundStarsSpread,
                },
                uBackgroundColor: {
                    type: "c",
                    value: new Vector3(
                        new Color(this._config.backgroundColor).r,
                        new Color(this._config.backgroundColor).g,
                        new Color(this._config.backgroundColor).b
                    ),
                },
            },
            vertexShader: backgroundVertexShader,
            fragmentShader: backgroundFragmentShader,
            side: DoubleSide,
        });

        this._background = new Mesh(geometry, material);
        this._background.position.z = -100;
        this._scene.add(this._background);
    }

    _initEvents() {
        window.addEventListener("resize", this._resize.bind(this));
        window.addEventListener("mousemove", this._onMouseMove.bind(this));
        window.addEventListener("click", this._onClick.bind(this));
    }

    _onMouseMove(event) {
        event.preventDefault();
        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this._background.material.uniforms.uMouse.value = this._mouse;
        this._camera.position.x = this._mouse.x * 25;
        this._camera.position.y = this._mouse.y * 25;
    }

    _onClick(event) {
        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this._updateClickEffect();
    }

    onDrag(e, delta) {
        this._isDragging = e.dragging;

        if (delta > 0 && this._slider.getMinX() + delta > 0) {
            delta = 0;
        }

        if (delta < 0 && this._slider.getMaxX() + delta < 0) {
            delta = 0;
        }

        const offset = Math.min(Math.abs(delta) * 0.001, 0.03);
        this._composer.updateOffset(offset, offset * 0.25);
        if (this._isDragging) {
            this._composer.setBlurEnabled(true);
        } else {
            this._composer.setBlurEnabled(false);
        }
        this._slider.onDrag(e, delta);
        this._fairyFlies.userData.destinationPosition.x += delta;
    }

    _resize() {
        this._composer.setSize(window.innerWidth, window.innerHeight);

        let fov =
            Math.atan(window.innerHeight / 2 / this._camera.position.z) * 2;
        fov = MathUtils.radToDeg(fov);
        this._camera.fov = fov;

        const aspect = window.innerWidth / window.innerHeight;
        this._camera.aspect = aspect;
        this._camera.updateProjectionMatrix();

        this._background.material.uniforms.resolution.value.x =
            window.innerWidth;

        this._background.scale.x = window.innerWidth / this._initialWidth;
        this._background.scale.y = window.innerHeight / this._initialHeight;
    }

    _start() {
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
    }

    _pause() {
        window.cancelAnimationFrame(this._raf);
    }

    _animate() {
        this._stats.begin();
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        this._deltaClock = this._clock.getDelta();
        this._deltaTimeComposer += this._deltaClock;

        if (!this._deltaTimeComposer || this._deltaTimeComposer > 0.01) {
            this._composer.updateOffset(0.001, 0.001);
            this._deltaTimeComposer = 0;
        }
        this._updateHoverEffect();
        this._slider.update();
        this._background.material.uniforms.time.value += this._deltaClock;
        this._fairyFlies.material.uniforms.uTime.value += this._deltaClock;
        damp(
            this._fairyFlies.position,
            "x",
            this._fairyFlies.userData.destinationPosition.x,
            0.1
        );
        const zTarget = this._isDragging
            ? this._fairyFlies.userData.dragPosition.z
            : this._fairyFlies.userData.initialPosition.z;

        damp(this._fairyFlies.position, "z", zTarget, 0.2);

        this._composer.render();
        this._stats.end();
    }

    _updateHoverEffect() {
        this._raycaster.setFromCamera(this._mouse, this._camera);

        const intersects = this._raycaster.intersectObjects(
            this._scene.children,
            true
        );

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                const intersected = intersects[i].object;

                if (intersected.userData.isSlide) {
                    this._slider.hover(intersected);
                }
            }
        }
    }

    _updateClickEffect() {
        this._raycaster.setFromCamera(this._mouse, this._camera);
        const intersects = this._raycaster.intersectObjects(
            this._scene.children,
            true
        );

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                const intersected = intersects[i].object;

                if (intersected.userData.isSlide) {
                    this._slider.click(intersected);
                }
            }
        }
    }

    changeConfiguration(config) {
        this._config = config;

        this._background.material.uniforms.spread.value =
            this._config.backgroundStarsSpread;

        this._background.material.uniforms.velocity.value =
            this._config.backgroundStarsVelocity;

        this._fairyFlies.material.uniforms.uPointSize.value =
            this._config.fairyFliesSize;

        this._fairyFlies.material.uniforms.uVelocity.value =
            this._config.fairyFliesVelocity;

        this._lightHelper.visible = this._config.lightHelper;

        this._light.color.set(this._config.lightColor);

        this._background.material.uniforms.uBackgroundColor.value = new Vector3(
            new Color(this._config.backgroundColor).r,
            new Color(this._config.backgroundColor).g,
            new Color(this._config.backgroundColor).b
        );

        this._composer.setBlockBlur(!this._config.blurEnabled);

        this._composer.setChromaticAberrationEnabled(
            this._config.chromaticAberrationEnabled
        );
    }
}
