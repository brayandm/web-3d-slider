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
        this._blockChromaticAberration = false;

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

    // Updating Offset of Chromatic Aberration
    updateOffset(x, y) {
        if (this._blockChromaticAberration) return;

        const newX = this._chromaticAberrationEffect.offset.x;
        const newY = this._chromaticAberrationEffect.offset.y;

        this._chromaticAberrationEffect.offset.set(
            newX + (x - newX) * 0.1,
            newY + (y - newY) * 0.1
        );
    }

    // Set Size of Composer
    setSize(width, height) {
        this._composer.setSize(width, height);
    }

    // Render Composer
    render() {
        this._composer.render();
    }

    // Block The Blur
    setBlockBlur(block) {
        this._blockBlur = block;
    }

    // Activate/Deactivate Blur
    setBlurEnabled(enabled) {
        if (this._blockBlur === false) {
            this._blurPass.enabled = enabled;
        }
    }

    // Activate/Deactivate Chromatic Aberration
    setChromaticAberrationEnabled(enabled) {
        this._blockChromaticAberration = !enabled;

        if (this._blockChromaticAberration === true) {
            this._chromaticAberrationEffect.offset.set(0, 0);
        }
    }
}
