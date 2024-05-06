import "./style.css";

import App from "./App/index.js";

import GUIController from "./App/GUIController/index.js";

const loading = document.querySelector(".loading-container");

new App(() => {
    loading.style.display = "none";
    const canvas = document.querySelector("#canvas");
    canvas.style.display = "block";
});

new GUIController();
