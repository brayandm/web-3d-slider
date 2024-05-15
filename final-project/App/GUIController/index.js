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
            .add(
                { backgroundStarsSpread: this.config.backgroundStarsSpread },
                "backgroundStarsSpread",
                0.999,
                1.003
            )
            .name("Spread of stars in Background")
            .onChange((v) => {
                this.config.backgroundStarsSpread = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add(
                {
                    backgroundStarsVelocity:
                        this.config.backgroundStarsVelocity,
                },
                "backgroundStarsVelocity",
                0,
                100
            )
            .name("Velocity of stars in Background")
            .onChange((v) => {
                this.config.backgroundStarsVelocity = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add(
                {
                    fairyFliesSize: this.config.fairyFliesSize,
                },
                "fairyFliesSize",
                0,
                20
            )
            .name("Size of Fairy Flies")
            .onChange((v) => {
                this.config.fairyFliesSize = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add(
                {
                    fairyFliesVelocity: this.config.fairyFliesVelocity,
                },
                "fairyFliesVelocity",
                0,
                10
            )
            .name("Velocity of Fairy Flies")
            .onChange((v) => {
                this.config.fairyFliesVelocity = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .add({ lightHelper: this.config.lightHelper }, "lightHelper")
            .name("Spot Light Helper")
            .onChange((v) => {
                this.config.lightHelper = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .addColor({ lightColor: this.config.lightColor }, "lightColor")
            .name("Spot Light Color")
            .onChange((v) => {
                this.config.lightColor = v;
                this._changeConfiguration(this.config);
            });

        this.gui
            .addColor(
                { backgroundColor: this.config.backgroundColor },
                "backgroundColor"
            )
            .name("Background Color")
            .onChange((v) => {
                this.config.backgroundColor = v;
                this._changeConfiguration(this.config);
            });
    }
}
