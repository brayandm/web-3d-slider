import {
    ChromaticAberrationEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
} from "postprocessing";
import { Clock, FloatType, Vector2 } from "three";

export default class Postprocessing {
    constructor({ renderer, scene, camera }) {
        this._renderer = renderer;
        this._scene = scene;
        this._camera = camera;
        this._clock = new Clock(true);
        this._nextUpdateTime = 0;

        this._init();
    }

    _init() {
        // INIT COMPOSER
        const composer = new EffectComposer(this._renderer, {
            frameBufferType: FloatType,
        });

        // RENDERPASS
        const renderPass = new RenderPass(this._scene, this._camera);

        // EFFECTPASS
        this._chromaticAberrationEffect = new ChromaticAberrationEffect({
            offset: new Vector2(0.005, 0.005),
        });

        const effectPass = new EffectPass(
            this._camera,
            this._chromaticAberrationEffect
        );

        // ADD PASSES
        composer.addPass(renderPass);
        composer.addPass(effectPass);

        this._composer = composer;
    }

    _updateChromaticAberration() {
        const x = (Math.random() - 0.5) * 0.05;
        const y = (Math.random() - 0.5) * 0.01;
        this._chromaticAberrationEffect.offset.set(x, y);

        const timeInterval = Math.random() * 100 + 50;
        this._nextUpdateTime = this._clock.elapsedTime + timeInterval / 1000;
    }

    render() {
        if (this._clock.getElapsedTime() >= this._nextUpdateTime) {
            this._updateChromaticAberration();
        }
        this._composer.render();
    }
}