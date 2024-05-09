import {
    Group,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    TextureLoader,
} from "three";

import { damp } from "maath/easing";

export default class Slider extends Group {
    constructor() {
        super();

        this._height = 1920 * 0.3;
        this._width = 1080 * 0.3;
        this._objects = [];

        this._isDragging = false;

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

            mesh.userData.destinationPosition = mesh.position.clone();
            mesh.userData.initialPosition = mesh.position.clone();
            mesh.userData.dragPosition = mesh.position.clone();

            this.add(mesh);
            this._objects.push(mesh);
        }
    }

    onDrag(e, delta) {
        this._isDragging = e.dragging;
        this._objects.forEach((el) => {
            el.userData.destinationPosition.x += delta;
        });
    }

    update(delta) {
        this._objects.forEach((el) => {
            damp(
                el.position,
                "x",
                el.userData.destinationPosition.x,
                0.1,
                delta
            );
        });
    }
}
