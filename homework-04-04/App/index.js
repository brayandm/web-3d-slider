import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    PlaneGeometry,
    ShaderMaterial,
    DirectionalLight,
    AmbientLight,
    Mesh,
    Clock,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

import vertex from "./shader/index.vert";
import fragment from "./shader/index.frag";

export default class App {
    constructor() {
        this._renderer = undefined;
        this._camera = undefined;
        this._scene = undefined;
        this._controls = undefined;
        this._raf = undefined;
        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);

        this._init();
    }

    _init() {
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
        this._camera.position.z = 4;
        this._camera.position.y = 2;
        this._camera.position.x = 2;

        // CLOCK
        this._clock = new Clock();

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
        const geometry = new PlaneGeometry(1, 1);
        const material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
        });
        const mesh = new Mesh(geometry, material);
        this._scene.add(mesh);

        // START
        this._initEvents();
        this._start();
    }

    _initEvents() {
        window.addEventListener("resize", this._onResize.bind(this));
    }

    _onResize() {
        const aspect = window.innerWidth / window.innerHeight;
        this._camera.aspect = aspect;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setPixelRatio(window.devicePixelRatio);
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
