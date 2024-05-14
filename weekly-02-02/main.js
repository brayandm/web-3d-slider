import "./style.css";

import App from "./App/index.js";
import { DragGesture } from "@use-gesture/vanilla";
import GUIController from "./App/GUIController/index.js";

const config = {
    backgroundStarsSpread: 1,
    backgroundStarsVelocity: 1,
    fairyFliesSize: 8,
    fairyFliesVelocity: 1,
    lightHelper: false,
    lightColor: "#ffffff",
    backgroundColor: "#191919",
};

const loading = document.querySelector(".loading-container");

const app = new App(config, () => {
    loading.style.display = "none";
    const canvas = document.querySelector("#canvas");
    canvas.style.display = "block";

    new DragGesture(canvas, (state) => {
        app.onDrag(state, state.delta[0]);
    });

    const changeConfiguration = (config) => {
        app.changeConfiguration(config);
    };

    new GUIController(config, changeConfiguration);
});
