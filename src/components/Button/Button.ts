import { Assets, Sprite, Text, TextStyle, Container, Ticker } from "pixi.js";
import RuslanDisplay from "/assets/Fonts/RuslanDisplay.ttf";
import ButtonTexture from "/assets/Button/Button.png";

export const createButton = async (onSelect?: () => void) => {
    await Assets.load(RuslanDisplay);
    const texture = await Assets.load(ButtonTexture);

    const buttonContainer = new Container();
    const button = new Sprite(texture);
    button.anchor.set(0.5);
    button.roundPixels = true;

    const buttonText = new Text({
        text: "ВЫБРАТЬ",
        style: new TextStyle({
            fontFamily: "RuslanDisplay",
            fontSize: 64,
            fill: "#F4F5F0",
        }),
    });

    buttonText.anchor.set(0.5);
    buttonText.resolution = window.devicePixelRatio;
    buttonText.roundPixels = true;

    buttonContainer.addChild(button, buttonText);

    let defaultScale = 1;

    const resizeButton = (bg: Sprite) => {
        buttonContainer.position.set(bg.x, bg.y + bg.height / 3.5);

        const scaleFactor = Math.min(bg.width / 2.5 / button.texture.width, 0.8);
        button.scale.set(scaleFactor);
        defaultScale = scaleFactor;

        const newFontSize = Math.min(bg.width / 18, bg.height / 14);
        buttonText.style.fontSize = Math.max(0, newFontSize);
        buttonText.position.set(0, -4);
    };

    button.eventMode = "static";
    button.cursor = "pointer";

    button.on("pointerdown", () => {
        animateBounce(button, buttonText, defaultScale * 0.9, defaultScale);

        if (onSelect) {
            onSelect();
        }
    });

    return { buttonContainer, resizeButton };
};

const animateBounce = (button: Sprite, buttonText: Text, pressedScale: number, normalScale: number) => {
    const ticker = new Ticker();
    let step = 0;

    ticker.add(() => {
        if (step === 0) {
            button.scale.set(pressedScale);
            buttonText.scale.set(pressedScale);
            step++;
        } else if (step < 5) {
            button.scale.set(button.scale.x + (normalScale - pressedScale) * 0.2);
            buttonText.scale.set(buttonText.scale.x + (normalScale - pressedScale) * 0.2);
            step++;
        } else {
            button.scale.set(normalScale);
            buttonText.scale.set(normalScale);
            ticker.stop();
        }
    });

    ticker.start();
};
