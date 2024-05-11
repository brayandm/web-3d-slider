import GUI from "lil-gui";

export default class GUIController {
    config = {
        primaryColor: "#5afffe",
        secondaryColor: "#e10d31",
        velocity: 0.01,
    };

    constructor(changeConfiguration = () => {}) {
        this._changeConfiguration = changeConfiguration;
        this.gui = new GUI();
        this.init();
    }

    init() {
        this.gui
            .addColor({ color: this.config.primaryColor }, "color")
            .name("Primary Color")
            .onChange(() => {
                this.config.primaryColor = this.gui.color;
                this._changeConfiguration(this.config);
            });

        this.gui
            .addColor({ color: this.config.secondaryColor }, "color")
            .name("Secondary Color")
            .onChange(() => {
                this.config.secondaryColor = this.gui.color;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add({ velocity: this.config.velocity }, "velocity")
            .name("Velocity")
            .onChange(() => {
                this.config.velocity = this.gui.velocity;
                this._changeConfiguration(this.config);
            });
    }
}
