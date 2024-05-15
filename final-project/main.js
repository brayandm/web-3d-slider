import "./style.css";

import App from "./App/index.js";
import { DragGesture } from "@use-gesture/vanilla";
import GUIController from "./App/GUIController/index.js";

const config = {
    backgroundStarsSpread: 1,
    backgroundStarsVelocity: 1,
    fairyFliesNumber: 200,
    fairyFliesSize: 8,
    fairyFliesVelocity: 1,
    lightHelper: false,
    lightColor: "#ffffff",
    backgroundColor: "#191919",
    blurEnabled: false,
    chromaticAberrationEnabled: true,
};

const loading = document.querySelector(".loading-container");

let devModeEnabled = false;

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

    const gui = new GUIController(config, changeConfiguration);

    const devModeButton = document.querySelector(".dev-mode-button");

    devModeButton.style.display = "block";

    devModeButton.addEventListener("click", () => {
        devModeEnabled = !devModeEnabled;

        if (devModeEnabled) {
            devModeButton.classList.add("active");
        } else {
            devModeButton.classList.remove("active");
        }

        app.setDevMode(devModeEnabled);
        gui.setDevMode(devModeEnabled);
    });
});
