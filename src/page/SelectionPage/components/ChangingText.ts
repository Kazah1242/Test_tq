import { Assets, Text, TextStyle, Container, Sprite } from "pixi.js";
import AlumniSans from "/assets/fonts/AlumniSans.ttf";

export const createChangingText = async () => {
    await Assets.load(AlumniSans);

    const textContainer = new Container();

    const textStyle = new TextStyle({
        fontFamily: "AlumniSans",
        fontSize: 64,
        fill: "#39373A",
        align: "center",
    });

    const text = new Text("я диспетчер", textStyle);
    text.anchor.set(0.5);
    text.resolution = window.devicePixelRatio;
    text.roundPixels = true;

    textContainer.addChild(text);

    const options = ["я диспетчер", "а что это значит?"];
    let currentIndex = 0;

    const updateText = (direction: "left" | "right") => {
        currentIndex = (direction === "left")
            ? (currentIndex - 1 + options.length) % options.length
            : (currentIndex + 1) % options.length;

        text.text = options[currentIndex];
    };

    const resizeText = (bg: Sprite) => {
        if (!bg) return;

        const scaleFactor = Math.min(bg.width / 8, bg.height / 10);
        text.style.fontSize = Math.max(32, scaleFactor);

        textContainer.position.set(bg.x, bg.y + bg.height / 10);
        text.position.set(0, 0);
    };

    return { textContainer, updateText, resizeText };
};
