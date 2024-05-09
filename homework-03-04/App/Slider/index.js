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

        this._height = 1920 * 0.2;
        this._width = 1080 * 0.2;
        this._objects = [];
        this._randMap = [];
        this._senseRandMap = [];

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
                side: 2,
            });
            const mesh = new Mesh(geometry, material);

            mesh.scale.set(this._width, this._height, 1);
            mesh.position.x = this._width * i * 1.5;
            mesh.position.y = MathUtils.randFloat(-75, 75);
            mesh.position.z = MathUtils.randFloat(-10, 10);

            mesh.userData.destinationPosition = mesh.position.clone();
            mesh.userData.initialPosition = mesh.position.clone();
            mesh.userData.dragPosition = mesh.position.clone();
            mesh.userData.dragPosition.z += MathUtils.randFloat(-50, -30);
            mesh.userData.isSlide = true;

            this.add(mesh);
            this._objects.push(mesh);
            this._randMap.push(MathUtils.randFloat(0, 10));
            this._senseRandMap.push(Math.random() < 0.5 ? -1 : 1);
        }
    }

    hover(object) {
        if (!this._isDragging) {
            object.position.z += 1;
        }
    }

    click(object) {
        if (!this._isDragging) {
        }
    }

    onDrag(e, delta) {
        this._isDragging = e.dragging;
        this._objects.forEach((el) => {
            el.userData.destinationPosition.x += delta;
        });
    }

    animate() {
        this._objects.forEach((el, index) => {
            el.userData.destinationPosition.x +=
                Math.cos(Date.now() * 0.001 + this._randMap[index]) *
                0.2 *
                this._senseRandMap[index];
            el.position.y +=
                Math.sin(Date.now() * 0.001 + this._randMap[index]) *
                0.2 *
                this._senseRandMap[index];
        });
    }

    update(delta) {
        this.animate();
        this._objects.forEach((el) => {
            damp(
                el.position,
                "x",
                el.userData.destinationPosition.x,
                0.1,
                delta
            );

            const zTarget = this._isDragging
                ? el.userData.dragPosition.z
                : el.userData.initialPosition.z;

            damp(el.position, "z", zTarget, 0.2, delta);
        });
    }
}
