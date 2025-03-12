import { Assets, Text, TextStyle, Container, Sprite } from "pixi.js";
import AlumniSans from "/assets/Fonts/AlumniSans.ttf";

export const createErrorText = async () => {
    await Assets.load(AlumniSans);

    const textContainer = new Container();

    const textStyle = new TextStyle({
        fontFamily: "AlumniSans",
        fontSize: 64,
        fill: "#39373A",
        align: "center",
    });

    const text = new Text({ 
        text: "вот и думайте", 
        style: textStyle 
    });
    text.anchor.set(0.5);
    text.resolution = window.devicePixelRatio;
    text.roundPixels = true;

    textContainer.addChild(text);

    const resizeText = (bg: Sprite) => {
        if (!bg) return;

        const scaleFactor = Math.min(bg.width / 8, bg.height / 10);
        text.style.fontSize = Math.max(0, scaleFactor);

        textContainer.position.set(bg.x, bg.y + bg.height / 4);     
        text.position.set(0, -50);
    };

    return { textContainer, resizeText };
};
