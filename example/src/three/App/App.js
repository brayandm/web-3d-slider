import { WebGLRenderer } from "three";

export default class App {
    _gl;

    constructor() {
        console.log("App constructor");
    }

    init() {
        this._gl = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
        });

        this._gl.setSize(window.innerWidth, window.innerHeight);
    }
}
