import "./style.css";

import App from "./App/index.js";
import GUIController from "./App/GUIController/index.js";

const app = new App(() => {
    const changeConfiguration = (config) => {
        app.changeConfiguration(config);
    };

    new GUIController(changeConfiguration);
});
