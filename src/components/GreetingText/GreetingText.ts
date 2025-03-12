import { Assets, Text, TextStyle, Sprite } from "pixi.js";
import RuslanDisplay from "/assets/Fonts/RuslanDisplay.ttf";

export const createGreetingText = async () => {
    await Assets.load(RuslanDisplay);

    const baseFontSize = 128;

    const text = new Text({
        text: "ДОБРЫЙ ВЕЧЕР",
        style: new TextStyle({
            fontFamily: "RuslanDisplay",
            fontSize: baseFontSize,
            fill: "#39373A",
            align: "center",
        }),
    });

    text.anchor.set(0.5);
    text.resolution = window.devicePixelRatio;
    text.roundPixels = true;

    const resizeText = (bg: Sprite) => {
        if (!bg) return;

        const scaleFactor = Math.min(bg.width / 8, bg.height / 10);
        const newScale = scaleFactor / baseFontSize;

        text.scale.set(newScale);
        text.position.set(bg.x, bg.y - bg.height / 10);
    };

    return { text, resizeText };
};
