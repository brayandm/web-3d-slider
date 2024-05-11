import "./style.css";

import App from "./App/index.js";
import GUIController from "./App/GUIController/index.js";

const config = {
    primaryColor: "#fff",
    secondaryColor: "#000",
    velocity: 0.01,
};

const app = new App(config, () => {
    const changeConfiguration = (config) => {
        app.changeConfiguration(config);
    };

    new GUIController(config, changeConfiguration);
});
