import { TextureLoader, VideoTexture } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const ASSETS = [
    { key: "applevision", type: "gltf", path: "/applevision.glb" },
    { key: "envmap", type: "envmap", path: "/envmap.hdr" },
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
                        console.log("reso");
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
