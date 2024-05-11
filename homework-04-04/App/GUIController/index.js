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
            .add({ velocity: this.config.velocity }, "velocity", 0, 10)
            .name("Velocity")
            .onChange((v) => {
                this.config.velocity = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add({ option: "Type 1" }, "option", ["Type 1", "Type 2", "Type 3"])
            .name("Movement Type")
            .onChange((v) => {
                this.config.movementType = parseInt(v[v.length - 1]);
                this._changeConfiguration(this.config);
            });
    }
}
