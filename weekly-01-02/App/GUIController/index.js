import GUI from "lil-gui";

export default class GUIController {
    constructor() {
        this.gui = new GUI();
        this.setup();
    }

    setup() {
        this.myObject = {
            myBoolean: true,
            myFunction: () => {
                console.log("Button clicked");
            },
            myString: "lil-gui",
            myNumber: 1,
        };

        this.gui.add(this.myObject, "myBoolean");
        this.gui.add(this.myObject, "myFunction");
        this.gui.add(this.myObject, "myString");
        this.gui.add(this.myObject, "myNumber");

        this.gui.add(this.myObject, "myNumber", 0, 1);
        this.gui.add(this.myObject, "myNumber", 0, 100, 2);

        this.gui.add(this.myObject, "myNumber", [0, 1, 2]);
        this.gui.add(this.myObject, "myNumber", {
            Label1: 0,
            Label2: 1,
            Label3: 2,
        });

        this.gui
            .add(this.myObject, "myNumber")
            .name("Custom Name")
            .onChange((value) => {
                console.log("Value changed to:", value);
            });

        const colorFormats = {
            string: "#ffffff",
            int: 0xffffff,
            object: { r: 1, g: 1, b: 1 },
            array: [1, 1, 1],
        };

        this.gui.addColor(colorFormats, "string");
    }
}
