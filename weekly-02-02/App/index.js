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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import Slider from "./Slider";
import resources from "./Resources";
import Composer from "./Postprocessing";

import backgroundVertexShader from "./Shaders/Background/index.vert";
import backgroundFragmentShader from "./Shaders/Background/index.frag";

export default class App {
    constructor(config, onLoaded = () => {}) {
        this._config = config;
        this._onLoaded = onLoaded;
        this._gl = undefined;
        this._composer = undefined;
        this._camera = undefined;
        this._scene = undefined;
        this._controls = undefined;
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

        // RESIZE RENDERER AND CAMERA
        this._resize();

        // ON LOADED
        this._onLoaded();

        // START
        this._start();
    }

    _initScene() {
        this._slider = new Slider();
        this._scene.add(this._slider);

        const geometry = new PlaneGeometry(100000, 20000);
        const material = new ShaderMaterial({
            uniforms: {
                time: { type: "f", value: 0 },
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
    }

    _onClick(event) {
        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this._updateClickEffect();
    }

    onDrag(e, delta) {
        this._slider.onDrag(e, delta);
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

        this._updateHoverEffect();
        this._slider.update();
        this._background.material.uniforms.time.value += this._clock.getDelta();

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

        this._lightHelper.visible = this._config.lightHelper;

        this._light.color.set(this._config.lightColor);
    }
}
