import { PerspectiveCamera, WebGLRenderer } from "three";

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
    }
}
