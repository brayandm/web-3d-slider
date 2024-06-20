import "./style.css";

import App from "./App/index.js";
import { DragGesture } from "@use-gesture/vanilla";
import GUIController from "./App/GUIController/index.js";

// Configuration
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

// Loading
const loading = document.querySelector(".loading-container");

let devModeEnabled = false;

// App
const app = new App(config, () => {
    // Hide loading
    loading.style.display = "none";

    // Show canvas
    const canvas = document.querySelector("#canvas");
    canvas.style.display = "block";

    // Drag gesture
    new DragGesture(canvas, (state) => {
        app.onDrag(state, state.delta[0]);
    });

    // Modify configuration
    const changeConfiguration = (config) => {
        app.changeConfiguration(config);
    };

    // GUI
    const gui = new GUIController(config, changeConfiguration);

    // Dev mode
    const devModeButton = document.querySelector(".dev-mode-button");

    devModeButton.style.display = "block";

    // Event listener for dev mode button
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
