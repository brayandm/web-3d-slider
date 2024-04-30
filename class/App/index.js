import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    SphereGeometry,
    TextureLoader,
    BackSide,
    RepeatWrapping,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

export default class App {
    constructor() {
        this._renderer = undefined;
        this._camera = undefined;
        this._scene = undefined;

        this._mesh = undefined;

        this._raf = undefined;
        this._stats = new Stats();
        document.body.appendChild(this._stats.dom);

        this._init();
    }

    _init() {
        this._renderer = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
        });

        const aspect = window.innerWidth / window.innerHeight;
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera = new PerspectiveCamera(75, aspect, 1, 100);
        this._camera.position.z = 5;

        this._scene = new Scene();

        // CONTROLS
        this._controls = new OrbitControls(
            this._camera,
            this._renderer.domElement
        );

        // MESH
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ wireframe: true });

        const mesh = new Mesh(geometry, material);
        this._mesh = mesh;

        const texture = new TextureLoader().load("App/assets/brick.jpg");
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.repeat.set(10, 10);

        this._sphere = new Mesh(
            new SphereGeometry(40, 40, 40, 0, Math.PI * 2, 0, Math.PI),
            new MeshBasicMaterial({
                map: texture,
                side: BackSide,
            })
        );

        // this._scene.add(this._mesh);
        this._scene.add(this._sphere);

        // START
        this._initEvents();
        this._start();

        this._animateSphere();
    }

    _initEvents() {
        window.addEventListener("resize", this._onResize.bind(this));
    }

    _moveSphere() {
        this._sphere.position.x = Math.sin(Date.now() * 0.001) * 2;
        this._sphere.position.y = Math.cos(Date.now() * 0.001) * 2;
    }

    _rotateSphere() {
        this._sphere.rotation.y += 0.01;
    }

    _animateSphere() {
        window.requestAnimationFrame(() => {
            // this._moveSphere();
            this._rotateSphere();
            this._animateSphere();
        });
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
