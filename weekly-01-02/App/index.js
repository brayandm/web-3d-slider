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
import Composer from "./Postprocessing";
import { gsap } from "gsap";

const CONFIG = {
    light: {
        ambientLightIntesity: 0.1,
        envMapIntensity: 1,
        directionalLightIntensity: 0.5,
    },
    dark: {
        ambientLightIntesity: 0,
        envMapIntensity: 0,
        directionalLightIntensity: 0.05,
    },
};

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
        this._version = "light";

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
        this._camera.position.z = 0.15;
        this._camera.position.y = 0.05;
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

        // CUBE WRAPPER INVISIBLE
        this._cubeWrapper = new Mesh(
            new BoxGeometry(10, 10, 10),
            new MeshStandardMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0,
                side: 2,
            })
        );
        this._scene.add(this._cubeWrapper);

        // COMPOSER
        this._initComposer();

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

    _initComposer() {
        this._composer = new Composer({
            renderer: this._renderer,
            scene: this._scene,
            camera: this._camera,
        });
    }

    _initLights() {
        // DIRECTIONAL LIGHT
        this._directionalLight = new DirectionalLight(
            0xffffff,
            CONFIG[this._version].directionalLightIntensity
        );
        this._directionalLight.color.set("#fff");
        this._directionalLight.position.y = 0.5;
        this._directionalLight.position.z = 0.5;
        this._directionalLight.castShadow = true;
        this._scene.add(this._directionalLight);

        // DIRECTIONAL LIGHT HELPER
        this._directionalLightHelper = new DirectionalLightHelper(
            this._directionalLight
        );
        this._directionalLight.shadow.mapSize.set(256, 256);
        this._directionalLight.shadow.camera.top = 0.15;
        this._directionalLight.shadow.camera.left = -0.15;
        this._directionalLight.shadow.camera.right = 0.15;
        this._directionalLight.shadow.camera.bottom = -0.15;
        this._directionalLight.shadow.camera.far = 1.5;
        this._directionalLight.shadow.camera.near = 0.5;
        this._directionalLightHelper.visible = false;
        this._scene.add(this._directionalLightHelper);

        // CAMERA HELPER
        this._cameraHelper = new CameraHelper(
            this._directionalLight.shadow.camera
        );
        this._cameraHelper.visible = false;
        this._scene.add(this._cameraHelper);

        // AMBIENT LIGHT
        this._ambientLight = new AmbientLight(
            0xffffff,
            CONFIG[this._version].ambientLightIntesity
        );
        this._scene.add(this._ambientLight);
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
        const time = performance.now() * 0.001;
        this._parent.rotation.y = Math.cos(time) * 0.2;
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
        this._composer.render();
        this._stats.end();
    }

    toggleHelpers() {
        this._cameraHelper.visible = !this._cameraHelper.visible;
        this._directionalLightHelper.visible =
            !this._directionalLightHelper.visible;
    }

    toggleOrbitControls(v) {
        this._controls.enabled = v;
    }

    togglePostprocessing(v) {
        this._composer.togglePostprocessing(v);
    }

    togglePostprocessingCrazy(v) {
        this._composer.togglePostprocessingCrazy(v);
    }

    changeVersion() {
        this._version = this._version === "light" ? "dark" : "light";

        const config = CONFIG[this._version];

        // CUBE WRAPPER
        gsap.to(this._cubeWrapper.material, {
            opacity: this._version === "dark" ? 1 : 0,
        });

        // LIGHTS
        gsap.to(this._ambientLight, { intensity: config.ambientLightIntesity });
        gsap.to(this._directionalLight, {
            intensity: config.directionalLightIntensity,
        });

        // ENVMAP
        this._scene.traverse((el) => {
            if (el.isMesh && el.material.envMapIntensity) {
                const { material } = el;
                gsap.to(material, { envMapIntensity: config.envMapIntensity });
            }
        });
    }
}
