import GUI from "lil-gui";

export default class GUIController {
    constructor(onCameraHelperChange = () => {}) {
        this._onCameraHelperChange = onCameraHelperChange;
        this.gui = new GUI();
        this.init();
    }

    init() {
        this.gui
            .add({ cameraHelper: false }, "cameraHelper")
            .onChange(this._onCameraHelperChange);
    }
}
