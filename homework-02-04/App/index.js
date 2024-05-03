import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    DirectionalLight,
    AmbientLight,
    Group,
    PMREMGenerator,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import resources from "./Resources";

export default class App {
    constructor(onLoaded = () => {}) {
        this._onLoaded = onLoaded;
        this._renderer = undefined;
        this._camera = undefined;
        this._scene = undefined;
        this._controls = undefined;
        this._parent = new Group();
        this._raf = undefined;
        this._stats = new Stats();

        this._init();
    }

    async _init() {
        // RESOURCES
        await resources.load();

        // RENDERER
        this._renderer = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
        });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.shadowMap.enabled = true;

        // CAMERA
        const aspect = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
        this._camera.position.z = 0.2;
        this._camera.position.y = 0.2;
        this._camera.position.x = 0.2;

        // SCENE
        this._scene = new Scene();

        // CONTROLS
        this._controls = new OrbitControls(
            this._camera,
            this._renderer.domElement
        );

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

        // PLANE
        const planeGeometry = new BoxGeometry(2, 0.1, 2);
        const planeMaterial = new MeshStandardMaterial({ color: 0x00ff00 });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.position.y = -0.5;
        plane.receiveShadow = true;
        this._scene.add(plane);

        // START
        this._initEvents();
        this._initResources();

        // ON LOADED
        this._onLoaded();

        // STATS
        document.body.appendChild(this._stats.dom);

        this._start();
    }

    _initResources() {
        // ENV MAP
        const hdrTexture = resources.get("envmap");
        const pmremGenerator = new PMREMGenerator(this._renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
        pmremGenerator.dispose();
        this._scene.background = envMap;
        this._scene.environment = envMap;

        // MODEL
        const spaceship = resources.get("applevision");
        this._parent.add(spaceship.scene);
        this._scene.add(this._parent);
    }

    _initEvents() {
        window.addEventListener("resize", this._onResize.bind(this));
    }

    _onResize() {
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
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        this._renderer.render(this._scene, this._camera);
        this._stats.end();
    }
}
