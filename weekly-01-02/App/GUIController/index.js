import GUI from "lil-gui";

export default class GUIController {
    constructor(onHelpersChange = () => {}) {
        this._onHelpersChange = onHelpersChange;
        this.gui = new GUI();
        this.init();
    }

    init() {
        this.gui
            .add({ helpers: false }, "helpers")
            .name("Helpers")
            .onChange(this._onHelpersChange);
    }
}
