import {
    Group,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    TextureLoader,
} from "three";

export default class Slider extends Group {
    constructor() {
        super();

        this._height = 1920 * 0.3;
        this._width = 1080 * 0.3;

        this._init();
    }

    _init() {
        for (let i = 1; i <= 12; i++) {
            const geometry = new PlaneGeometry(1, 1);

            const texture = new TextureLoader().load(
                `./unsamples/image-` + i + `.jpg`
            );

            const material = new MeshBasicMaterial({
                map: texture,
            });
            const mesh = new Mesh(geometry, material);

            mesh.scale.set(this._width, this._height, 1);
            mesh.position.x = this._width * i * 1.5;

            this.add(mesh);
        }
    }
}
