import GUI from "lil-gui";

export default class GUIController {
    constructor(onHelpersChange = () => {}, onOrbitControllsChange = () => {}) {
        this._onHelpersChange = onHelpersChange;
        this._onOrbitControllsChange = onOrbitControllsChange;
        this.gui = new GUI();
        this.init();
    }

    init() {
        this.gui
            .add({ helpers: false }, "helpers")
            .name("Helpers")
            .onChange(this._onHelpersChange);

        this.gui
            .add({ orbitControls: true }, "orbitControls")
            .name("Orbit Controls")
            .onChange(this._onOrbitControllsChange);
    }
}
