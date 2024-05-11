import GUI from "lil-gui";

export default class GUIController {
    config = {
        primaryColor: "#ffae23",
        secondaryColor: "#ffae23",
        velocity: 0.01,
    };

    constructor(changeConfiguration = () => {}) {
        this._changeConfiguration = changeConfiguration;
        this.gui = new GUI();
        this.init();
    }

    init() {
        this.gui
            .addColor({ color: "#ffae23" }, "color")
            .name("Primary Color")
            .onChange(() => {
                this.config.primaryColor = this.gui.color;
                this._changeConfiguration(this.config);
            });

        this.gui
            .addColor({ color: "#ffae23" }, "color")
            .name("Secondary Color")
            .onChange(() => {
                this.config.secondaryColor = this.gui.color;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add({ velocity: 0.01 }, "velocity")
            .name("Velocity")
            .onChange(() => {
                this.config.velocity = this.gui.velocity;
                this._changeConfiguration(this.config);
            });
    }
}
