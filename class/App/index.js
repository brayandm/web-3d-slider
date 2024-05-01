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
    MeshStandardMaterial,
    DirectionalLight,
    AmbientLight,
    EquirectangularReflectionMapping,
    SRGBColorSpace,
    Vector2,
    PointLight,
    SpotLight,
    DoubleSide,
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
        this._renderer.shadowMap.enabled = true;
        this._camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
        this._camera.position.z = 8;
        this._camera.position.y = 3;

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

        const texture = new TextureLoader().load("App/assets/earthhd.jpg");

        //add bump map

        texture.bumpMap = new TextureLoader().load("App/assets/earthbump.jpg");

        // add normal map

        texture.normalMap = new TextureLoader().load(
            "App/assets/earthnormal.webp"
        );

        texture.normalScale = new Vector2(1, 1);

        // LIGHT

        this._light = new SpotLight(0xffffff, 1);
        this._light.position.set(20, 20, 20);
        this._light.castShadow = true;
        this._light.shadow.mapSize.width = 5000;
        this._light.shadow.mapSize.height = 5000;

        this._scene.add(this._light);

        this._sphere = new Mesh(
            new SphereGeometry(2, 40, 40, 0, Math.PI * 2, 0, Math.PI),
            new MeshStandardMaterial({
                map: texture,
                // bumpMap: texture.bumpMap,
                normalMap: texture.normalMap,
                normalScale: texture.normalScale,
            })
        );

        this._sphere.receiveShadow = true;

        const texture2 = new TextureLoader().load("App/assets/stars3.jpg");
        texture2.wrapS = texture2.wrapT = RepeatWrapping;
        texture2.repeat.set(10, 10);

        this._universe = new Mesh(
            new SphereGeometry(90, 40, 40),
            new MeshBasicMaterial({
                map: texture2,
                side: BackSide,
            })
        );

        {
            const loader = new TextureLoader();
            const texture = loader.load("App/assets/skybox4.jpg", () => {
                texture.mapping = EquirectangularReflectionMapping;
                texture.colorSpace = SRGBColorSpace;
                this._scene.background = texture;
            });
        }

        this._moon = new Mesh(
            new SphereGeometry(0.5, 40, 40),
            new MeshStandardMaterial({
                map: new TextureLoader().load("App/assets/moon.jpg"),
            })
        );

        //moon shadow

        this._moon.castShadow = true;

        this._moon.position.x = 4;
        this._moon.position.y = 1;

        this._sun = new Mesh(
            new SphereGeometry(5, 40, 40),
            new MeshBasicMaterial({
                map: new TextureLoader().load("App/assets/sun.jpg"),
                side: DoubleSide,
            })
        );

        const ambientLight = new AmbientLight(0xffffff, 0.02); // color y la intensidad
        this._scene.add(ambientLight);

        this._sun.position.set(20, 20, 20);

        this._scene.add(this._sun);

        // this._scene.add(this._mesh);
        this._scene.add(this._sphere);
        this._scene.add(this._moon);

        // START
        this._initEvents();
        this._start();

        this._animateSphere();
        this._animateMoon();
        this._animateUniverse();
        this._animateSun();
        this._animateLight();
    }

    _initEvents() {
        window.addEventListener("resize", this._onResize.bind(this));
    }

    _rotateMoon() {
        this._moon.rotation.y += 0.01;
    }

    _rotateUniverse() {
        this._universe.rotation.y += 0.0001;
    }

    _animateUniverse() {
        window.requestAnimationFrame(() => {
            this._rotateUniverse();
            this._animateUniverse();
        });
    }

    _scaleLight() {
        this._light.intensity *= 1.0005;
        this._light.distance *= 1.0005;
    }

    _animateLight() {
        window.requestAnimationFrame(() => {
            this._scaleLight();
            this._animateLight();
        });
    }

    _rotateSun() {
        this._sun.rotation.y += 0.001;
    }

    _scaleSun() {
        this._sun.scale.x *= 1.0005;
        this._sun.scale.y *= 1.0005;
        this._sun.scale.z *= 1.0005;
    }

    _animateSun() {
        window.requestAnimationFrame(() => {
            this._rotateSun();
            this._scaleSun();
            this._animateSun();
        });
    }

    _rotateMoonAroundEarth() {
        this._moon.position.x = Math.sin(Date.now() * 0.0005) * 3;
        this._moon.position.z = Math.cos(Date.now() * 0.0005) * 3;
        this._moon.position.y = Math.cos(Date.now() * 0.0005) * 3;
    }

    _animateMoon() {
        window.requestAnimationFrame(() => {
            this._rotateMoon();
            this._rotateMoonAroundEarth();
            this._animateMoon();
        });
    }

    _moveSphere() {
        this._sphere.position.x = Math.sin(Date.now() * 0.001) * 2;
        this._sphere.position.y = Math.cos(Date.now() * 0.001) * 2;
    }

    _rotateSphere() {
        this._sphere.rotation.y += 0.001;
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
