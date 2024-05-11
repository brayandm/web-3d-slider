import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    ShaderMaterial,
    BufferAttribute,
    Color,
    Mesh,
    Clock,
    SphereGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

import vertex from "./shader/index.vert";
import fragment from "./shader/index.frag";

export default class App {
    constructor(config, onLoaded = () => {}) {
        this._config = config;
        this._onLoaded = onLoaded;
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

        // START
        this._initEvents();
        this._initMesh();
        this._onLoaded();
        this._start();
    }

    _initMesh() {
        const geometry = new SphereGeometry(1, 250, 250);

        const count = geometry.attributes.position.count;

        const randomArray = [];
        const colorArray = [];

        for (let i = 0; i < count; i++) {
            randomArray.push(Math.random());
            colorArray.push(Math.random(), Math.random(), Math.random());
        }

        const bufferAttribute = new BufferAttribute(
            new Float32Array(randomArray),
            1
        );

        const colorAttribute = new BufferAttribute(
            new Float32Array(colorArray),
            3
        );

        geometry.setAttribute("aRandom", bufferAttribute);
        geometry.setAttribute("aColor", colorAttribute);

        const material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uColor1: { value: new Color(this._config.primaryColor) },
                uColor2: { value: new Color(this._config.secondaryColor) },
                uVelocity: { value: this._config.velocity },
                uTime: { value: 0 },
            },
        });

        this._mesh = new Mesh(geometry, material);

        this._scene.add(this._mesh);
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
        this._clock.delta = this._clock.getDelta();
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        this._mesh.material.uniforms.uTime.value = this._clock.elapsedTime;
        this._renderer.render(this._scene, this._camera);
        this._stats.end();
    }

    changeConfiguration(config) {
        this._config = config;

        this._mesh.material.uniforms.uColor1.value = new Color(
            this._config.primaryColor
        );
        this._mesh.material.uniforms.uColor2.value = new Color(
            this._config.secondaryColor
        );
        this._mesh.material.uniforms.uVelocity.value = this._config.velocity;
    }
}
