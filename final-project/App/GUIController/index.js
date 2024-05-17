import GUI from "lil-gui";

export default class GUIController {
    constructor(config, changeConfiguration = () => {}) {
        this.config = config;
        this._changeConfiguration = changeConfiguration;
        this.gui = new GUI();
        this.gui.hide();
        this.init();
    }

    // Enable or disable dev mode
    setDevMode(enable) {
        if (enable) {
            this.gui.show();
        } else {
            this.gui.hide();
        }
    }

    init() {
        // Add Background Stars Spread Control
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

        // Add Background Stars Velocity Control
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

        // Add Fairy Flies Number Control
        this.gui
            .add(
                {
                    fairyFliesNumber: this.config.fairyFliesNumber,
                },
                "fairyFliesNumber",
                0,
                2000
            )
            .name("Number of Fairy Flies")
            .onChange((v) => {
                this.config.fairyFliesNumber = v;
                this._changeConfiguration(this.config);
            });

        // Add Fairy Flies Size Control
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

        // Add Fairy Flies Velocity Control
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

        // Add Light Helper Control
        this.gui
            .add({ lightHelper: this.config.lightHelper }, "lightHelper")
            .name("Spot Light Helper")
            .onChange((v) => {
                this.config.lightHelper = v;
                this._changeConfiguration(this.config);
            });

        // Add Light Color Control
        this.gui
            .addColor({ lightColor: this.config.lightColor }, "lightColor")
            .name("Spot Light Color")
            .onChange((v) => {
                this.config.lightColor = v;
                this._changeConfiguration(this.config);
            });

        // Add Background Color Control
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

        // Add Blur Effect Control
        this.gui
            .add(
                {
                    blurEnabled: this.config.blurEnabled,
                },
                "blurEnabled"
            )
            .name("Blur Effect")
            .onChange((v) => {
                this.config.blurEnabled = v;
                this._changeConfiguration(this.config);
            });

        // Add Chromatic Aberration Effect Control
        this.gui
            .add(
                {
                    chromaticAberrationEnabled:
                        this.config.chromaticAberrationEnabled,
                },
                "chromaticAberrationEnabled"
            )
            .name("Chromatic Aberration Effect")
            .onChange((v) => {
                this.config.chromaticAberrationEnabled = v;
                this._changeConfiguration(this.config);
            });
    }
}
