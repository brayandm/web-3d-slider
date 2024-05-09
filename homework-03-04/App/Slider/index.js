import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export default class Slider extends Group {
    constructor() {
        super();

        this._width = 50;

        this._init();
    }

    _init() {
        for (let i = 0; i < 12; i++) {
            const geometry = new PlaneGeometry(1, 1);
            const material = new MeshBasicMaterial();
            const mesh = new Mesh(geometry, material);

            mesh.scale.set(this._width, this._width, 1);

            this.add(mesh);
        }
    }
}
