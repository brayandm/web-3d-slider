import "./style.css";

import App from "./App/index.js";

import GUIController from "./App/GUIController/index.js";

const loading = document.querySelector(".loading-container");

const app = new App(() => {
    loading.style.display = "none";
    const canvas = document.querySelector("#canvas");
    canvas.style.display = "block";

    const onHelperChange = (v) => {
        app.toggleHelpers(v);
    };

    const onOrbitControllsChange = (v) => {
        app.toggleOrbitControls(v);
    };

    const onPostprocessingChange = (v) => {
        app.togglePostprocessing(v);
    };

    const onPostprocessingCrazyChange = (v) => {
        app.togglePostprocessingCrazy(v);
    };

    new GUIController(
        onHelperChange,
        onOrbitControllsChange,
        onPostprocessingChange,
        onPostprocessingCrazyChange
    );

    const button = document.querySelector(".button");

    button.style.display = "block";

    button.addEventListener("click", () => {
        app.changeVersion();
    });

    const text = document.querySelector(".text");

    text.style.display = "block";
});
