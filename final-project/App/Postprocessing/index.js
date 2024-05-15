import {
    ChromaticAberrationEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    BlurPass,
} from "postprocessing";
import { FloatType, Vector2 } from "three";

export default class Postprocessing {
    constructor({ renderer, scene, camera }) {
        this._renderer = renderer;
        this._scene = scene;
        this._camera = camera;
        this._blockBlur = true;

        this._init();
    }

    _init() {
        // INIT COMPOSER
        const composer = new EffectComposer(this._renderer, {
            frameBufferType: FloatType,
        });

        // RENDERPASS
        const renderPass = new RenderPass(this._scene, this._camera);

        // BLURPASS
        this._blurPass = new BlurPass({
            resolutionScale: 0.5,
            kernelSize: 1,
        });
        this._blurPass.enabled = false;

        // EFFECTPASS
        this._chromaticAberrationEffect = new ChromaticAberrationEffect({
            offset: new Vector2(0.001, 0.001),
        });

        this._effectPass = new EffectPass(
            this._camera,
            this._chromaticAberrationEffect
        );

        // ADD PASSES
        composer.addPass(renderPass);
        composer.addPass(this._blurPass);
        composer.addPass(this._effectPass);

        this._composer = composer;
    }

    updateOffset(x, y) {
        const newX = this._chromaticAberrationEffect.offset.x;
        const newY = this._chromaticAberrationEffect.offset.y;

        this._chromaticAberrationEffect.offset.set(
            newX + (x - newX) * 0.1,
            newY + (y - newY) * 0.1
        );
    }

    setSize(width, height) {
        this._composer.setSize(width, height);
    }

    render() {
        this._composer.render();
    }

    setBlockBlur(block) {
        this._blockBlur = block;
    }

    setBlurEnabled(enabled) {
        console.log("setBlurEnabled", enabled, this._blockBlur);
        if (this._blockBlur === false) {
            this._blurPass.enabled = enabled;
        }
    }

    setChromaticAberrationEnabled(enabled) {
        this._chromaticAberrationEffect.enabled = enabled;
    }
}
