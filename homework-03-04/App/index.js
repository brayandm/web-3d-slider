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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import Slider from "./Slider";
import resources from "./Resources";
import Composer from "./Postprocessing";

export default class App {
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
        this._scene.background = new Color(0x0f0f0f);
        this._slider = new Slider();
        this._scene.add(this._slider);
    }

    _initEvents() {
        window.addEventListener("resize", this._resize.bind(this));
        window.addEventListener("mousemove", this._onMouseMove.bind(this));
    }

    _onMouseMove(event) {
        event.preventDefault();
        this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onDrag(e, delta) {
        this._slider.onDrag(e, delta);
    }

    _resize() {
        let fov =
            Math.atan(window.innerHeight / 2 / this._camera.position.z) * 2;
        fov = MathUtils.radToDeg(fov);
        this._camera.fov = fov;

        const aspect = window.innerWidth / window.innerHeight;
        this._camera.aspect = aspect;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth, window.innerHeight);
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
    }

    _updateHoverEffect() {
        this._raycaster.setFromCamera(this._mouse, this._camera);

        const intersects = this._raycaster.intersectObjects(
            this._scene.children,
            true
        );

        if (intersects.length > 0) {
            const intersected = intersects[0].object;

            this._slider.hover(intersected);
        }
    }
}
