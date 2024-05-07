import { TextureLoader } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const ASSETS = [
    { key: "applevision", type: "gltf", path: "/applevision.glb" },
    { key: "plane", type: "gltf", path: "/plane.glb" },
    { key: "envmap", type: "envmap", path: "/envmap.hdr" },
    { key: "wood-ao", type: "texture", path: "/wood/ao.png" },
    { key: "wood-col", type: "texture", path: "/wood/col.png" },
    { key: "wood-metalness", type: "texture", path: "/wood/metalness.png" },
    { key: "wood-nrm", type: "texture", path: "/wood/nrm.png" },
    { key: "wood-roughness", type: "texture", path: "/wood/roughness.png" },
];

class Resources {
    constructor() {
        this._resouces = new Map();

        this._loaders = {
            tl: new TextureLoader(),
            gltf: new GLTFLoader(),
            rgbe: new RGBELoader(),
        };
    }

    get(v) {
        return this._resouces.get(v);
    }

    async load() {
        const promises = ASSETS.map((el) => {
            // GTLF
            let prom;
            if (el.type === "gltf") {
                prom = new Promise((res) => {
                    this._loaders.gltf.load(el.path, (model) => {
                        this._resouces.set(el.key, model);
                        res();
                    });
                });
            }

            // ENVMAP
            if (el.type === "envmap") {
                prom = new Promise((res) => {
                    this._loaders.rgbe.load(el.path, (texture) => {
                        this._resouces.set(el.key, texture);
                        res();
                    });
                });
            }

            // TEXTURE
            if (el.type === "texture") {
                prom = new Promise((res) => {
                    this._loaders.tl.load(el.path, (texture) => {
                        this._resouces.set(el.key, texture);
                        res();
                    });
                });
            }

            return prom;
        });

        await Promise.all(promises);
    }
}

const resouces = new Resources();
export default resouces;
