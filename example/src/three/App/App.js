import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";

export default class App {
    _gl;

    constructor() {
        console.log("App constructor");
    }

    init() {
        // RENDERER
        this._gl = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
        });

        this._gl.setSize(window.innerWidth, window.innerHeight);

        // CAMERA
        const aspect = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(60, aspect, 1, 100);
        this._camera.position.y = 0.8;
        this._camera.position.z = 5;

        // SCENE
        this._scene = new Scene();

        // OBJECT
        const cubeGeometry = new BoxGeometry(1, 1, 1);

        const cubeMaterial = new MeshBasicMaterial();

        const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);

        this._scene.add(cubeMesh);

        this._animate();

        this._initEvents();
    }

    _initEvents() {
        window.addEventListener("resize", () => this._resize());
    }

    _resize() {
        this._gl.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }

    _animate() {
        this._gl.render(this._scene, this._camera);
        window.requestAnimationFrame(() => this._animate());
    }
}
