import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    AmbientLight,
    MathUtils,
    Color,
    Clock,
    Raycaster,
    Vector2,
    DoubleSide,
    Mesh,
    ShaderMaterial,
    PlaneGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import Slider from "./Slider";
import resources from "./Resources";
import Composer from "./Postprocessing";

export default class App {
    vertexShaderCode = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    fragmentShaderCode = `
uniform float time;
uniform vec2 resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    float brightness = random(st + time * 0.0000005);
    brightness = step(0.9991, brightness); 
    vec3 starColor = vec3(brightness);
    vec3 backgroundColor = vec3(0.01, 0.01, 0.01);
    gl_FragColor = vec4(mix(backgroundColor, starColor, brightness), 1.0);
}
`;

    constructor(onLoaded = () => {}) {
        this._onLoaded = onLoaded;
        this._renderer = undefined;
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

        // RENDERER
        this._renderer = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
            antialias: true,
        });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.shadowMap.enabled = true;

        // CAMERA
        const aspect = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
        this._camera.position.z = 100;

        // SETUP CAMERA
        this._resize();

        // CLOCK
        this._clock = new Clock();

        // SCENE
        this._scene = new Scene();

        // CONTROLS
        this._controls = new OrbitControls(
            this._camera,
            this._renderer.domElement
        );
        this._controls.enabled = false;

        // LIGHT
        const light = new DirectionalLight(0xffffff, 1);
        light.position.set(0, 2, 2);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this._scene.add(light);

        // AMBIENT LIGHT
        const ambientLight = new AmbientLight(0xffffff, 0.1);
        this._scene.add(ambientLight);

        // START
        this._initEvents();
        this._initResources();
        this._initScene();
        this._initComposer();

        // ON LOADED
        this._onLoaded();

        // START
        this._start();
    }

    _initComposer() {
        this._composer = new Composer({
            renderer: this._renderer,
            scene: this._scene,
            camera: this._camera,
        });
    }

    _initResources() {}

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
            },
            vertexShader: this.vertexShaderCode,
            fragmentShader: this.fragmentShaderCode,
            side: DoubleSide,
        });

        const background = new Mesh(geometry, material);
        background.position.z = -100;
        this._scene.add(background);
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
        event.preventDefault();
        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this._updateClickEffect();
    }

    onDrag(e, delta) {
        this._slider.onDrag(e, delta);
    }

    _resize() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(window.devicePixelRatio);

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
        this._updateHoverEffect();
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        this._clock.delta = this._clock.getDelta();
        this._slider.update();
        this._composer.render();
        this._stats.end();

        this._scene.children.forEach((child) => {
            if (
                child.material &&
                child.material.uniforms &&
                child.material.uniforms.time
            ) {
                child.material.uniforms.time.value += this._clock.getDelta();
            }
        });
    }

    _updateHoverEffect() {
        this._raycaster.setFromCamera(this._mouse, this._camera);

        const intersects = this._raycaster.intersectObjects(
            this._scene.children,
            true
        );

        if (intersects.length > 0) {
            const intersected = intersects[0].object;

            if (intersected.userData.isSlide) {
                this._slider.hover(intersected);
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
            const intersected = intersects[0].object;

            this._slider.click(intersected);
        }
    }
}
