import "./style.css";

import App from "./App/index.js";
import { DragGesture } from "@use-gesture/vanilla";

const loading = document.querySelector(".loading-container");

const app = new App(() => {
    loading.style.display = "none";
    const canvas = document.querySelector("#canvas");
    canvas.style.display = "block";

    new DragGesture(canvas, (state) => {
        app.onDrag(state, state.delta[0]);
    });
});
