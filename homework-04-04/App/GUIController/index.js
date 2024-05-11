import GUI from "lil-gui";

export default class GUIController {
    constructor(config, changeConfiguration = () => {}) {
        this.config = config;
        this._changeConfiguration = changeConfiguration;
        this.gui = new GUI();
        this.init();
    }

    init() {
        this.gui
            .addColor({ color: this.config.primaryColor }, "color")
            .name("Primary Color")
            .onChange((v) => {
                this.config.primaryColor = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .addColor({ color: this.config.secondaryColor }, "color")
            .name("Secondary Color")
            .onChange((v) => {
                this.config.secondaryColor = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add({ velocity: this.config.velocity }, "velocity")
            .name("Velocity")
            .onChange((v) => {
                this.config.velocity = v;
                this._changeConfiguration(this.config);
            });
    }
}
