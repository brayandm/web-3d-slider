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
    PCFSoftShadowMap,
    DirectionalLightHelper,
    CameraHelper,
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
        this._renderer.shadowMap.type = PCFSoftShadowMap;

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

        // PLANE
        const planeGeometry = new BoxGeometry(2, 0.1, 2);
        const planeMaterial = new MeshStandardMaterial({
            aoMap: resources.get("wood-ao"),
            map: resources.get("wood-col"),
            displacementMap: resources.get("wood-disp"),
            metalnessMap: resources.get("wood-metalness"),
            normalMap: resources.get("wood-nrm"),
            roughnessMap: resources.get("wood-roughness"),
        });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.position.y = -0.5;
        plane.receiveShadow = true;
        this._scene.add(plane);

        // START
        this._initEvents();
        this._initResources();
        this._initLights();

        // ON LOADED
        this._onLoaded();

        // STATS
        document.body.appendChild(this._stats.dom);

        this._start();
    }

    _initLights() {
        // DIRECTIONAL LIGHT
        const directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.color.set("#fff");
        directionalLight.position.y = 0.5;
        directionalLight.position.z = 0.5;
        directionalLight.castShadow = true;
        this._scene.add(directionalLight);

        // DIRECTIONAL LIGHT HELPER
        const directionalLightHelper = new DirectionalLightHelper(
            directionalLight
        );
        directionalLight.shadow.mapSize.set(256, 256);
        directionalLight.shadow.camera.top = 0.15;
        directionalLight.shadow.camera.left = -0.15;
        directionalLight.shadow.camera.right = 0.15;
        directionalLight.shadow.camera.bottom = -0.15;
        directionalLight.shadow.camera.far = 1.5;
        directionalLight.shadow.camera.near = 0.5;
        this._scene.add(directionalLightHelper);

        // CAMERA HELPER
        const cameraHelper = new CameraHelper(directionalLight.shadow.camera);
        this._scene.add(cameraHelper);

        // AMBIENT LIGHT
        const ambientLight = new AmbientLight(0xffffff, 0.1);
        this._scene.add(ambientLight);
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
        this._model = resources.get("applevision");
        this._model.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this._parent.add(this._model.scene);
        this._scene.add(this._parent);
    }

    _animateModel() {
        this._parent.rotation.y += 0.01;
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
        this._animateModel();
        this._raf = window.requestAnimationFrame(this._animate.bind(this));
        this._renderer.render(this._scene, this._camera);
        this._stats.end();
    }
}
