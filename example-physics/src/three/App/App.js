// import { Stats } from "fs";
import {
    BoxGeometry,
    IcosahedronGeometry,
    Mesh,
    MeshBasicMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    Scene,
    Shape,
    ShapeGeometry,
    SphereGeometry,
    WebGLRenderer,
} from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import Stats from "stats.js";
import { RapierPhysics } from "../RapierPhysics";

export default class App {
    constructor() {
        console.log("App constructor");
    }

    async init() {
        // RENDERER
        this._gl = new WebGLRenderer({
            canvas: document.querySelector("#canvas"),
        });

        this._gl.setSize(window.innerWidth, window.innerHeight);

        // CAMERA
        const aspect = window.innerWidth / window.innerHeight;
        this._camera = new PerspectiveCamera(60, aspect, 1, 100);
        this._camera.position.y = 20;
        this._camera.position.z = 30;
        this._camera.position.x = 20;

        this._physics = await RapierPhysics();

        // SCENE
        this._scene = new Scene();

        // OBJECT
        // made complex geometry to test physics

        const heartShape = new Shape();

        const x = 0;
        const y = 0;

        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(
            x + 12,
            y + 15.4,
            x + 16,
            y + 11,
            x + 16,
            y + 7
        );
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        for (let i = 0; i < 100; i++) {
            const geometry = new ShapeGeometry(heartShape);

            const material = new MeshBasicMaterial({
                color: 0xff0000,
                side: 2,
            });

            const mesh = new Mesh(geometry, material);

            mesh.position.x = Math.random() * 20 - 10;
            mesh.position.y = Math.random() * 100 + 5;
            mesh.position.z = Math.random() * 20 - 10;

            mesh.scale.set(0.1, 0.1, 0.1);

            mesh.rotation.x = 1;
            mesh.rotation.y = 1;
            mesh.rotation.z = 1;

            mesh.userData.physics = {
                mass: 10,
            };

            const cube = new Mesh(
                new BoxGeometry(1, 1, 1),
                new MeshBasicMaterial({ color: 0x0000ff })
            );

            cube.position.x = Math.random() * 20 - 10;
            cube.position.y = Math.random() * 100 + 5;
            cube.position.z = Math.random() * 20 - 10;

            cube.rotation.x = 1;
            cube.rotation.y = 1;
            cube.rotation.z = 1;

            cube.userData.physics = {
                mass: 10,
            };

            this._scene.add(cube);
            this._scene.add(mesh);
        }

        const floor = new Mesh(
            new BoxGeometry(60, 0.1, 60),
            new MeshBasicMaterial({ color: 0x00ff00 })
        );

        floor.position.y = -1;

        floor.userData.physics = {
            mass: 0.0,
        };

        this._scene.add(floor);

        // CONTROLS

        const controls = new OrbitControls(this._camera, this._gl.domElement);

        // STATS

        this._stats = new Stats();

        this._stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom

        this._physics.addScene(this._scene);

        document.body.appendChild(this._stats.dom);

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
        this._stats.begin();
        this._gl.render(this._scene, this._camera);
        this._stats.end();
        window.requestAnimationFrame(() => this._animate());
    }
}
