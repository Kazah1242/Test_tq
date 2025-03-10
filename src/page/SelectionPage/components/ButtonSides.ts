import { Assets, Sprite, Container, Ticker } from "pixi.js";
import RightButtonTexture from "/assets/SelectionPage/components/ButtonSL.png";
import LeftButtonTexture from "/assets/SelectionPage/components/ButtonSLlf.png";

export const createButtonSides = async (updateText: (direction: "left" | "right") => void) => {
    const sidesContainer = new Container();

    const addClickEffect = (target: Sprite, direction: "left" | "right") => {
        let isPressed = false;
        const baseScale = target.scale.x;

        target.on("pointerdown", () => {
            isPressed = true;
            animateScale(target, baseScale * 0.9);
        });

        target.on("pointerup", () => {
            isPressed = false;
            animateScale(target, baseScale);
            updateText(direction);
        });

        target.on("pointerupoutside", () => {
            isPressed = false;
            animateScale(target, baseScale);
        });
    };

    const animateScale = (target: Sprite, targetScale: number) => {
        const ticker = new Ticker();
        ticker.add(() => {
            target.scale.x += (targetScale - target.scale.x) * 0.2;
            target.scale.y += (targetScale - target.scale.y) * 0.2;

            if (Math.abs(target.scale.x - targetScale) < 0.01) {
                target.scale.set(targetScale);
                ticker.stop();
            }
        });
        ticker.start();
    };

    const createSideButton = async (texturePath: string, direction: "left" | "right") => {
        const button = new Sprite(await Assets.load(texturePath));
        button.anchor.set(0.5);
        button.roundPixels = true;
        button.eventMode = "static";
        button.cursor = "pointer";

        addClickEffect(button, direction);
        return button;
    };

    const [leftSide, rightSide] = await Promise.all([
        createSideButton(LeftButtonTexture, "left"),
        createSideButton(RightButtonTexture, "right"),
    ]);

    sidesContainer.addChild(leftSide, rightSide);

    const resizeSides = (buttonContainer: Container) => {
        const buttonSprite = buttonContainer.children.find(child => child instanceof Sprite) as Sprite | undefined;
        if (!buttonSprite) return;

        const scaleFactor = Math.min(buttonSprite.width / 2.8 / leftSide.texture.width, 1);
        leftSide.scale.set(scaleFactor);
        rightSide.scale.set(scaleFactor);

        const spacing = buttonSprite.width / 2 + leftSide.width * scaleFactor / 1.3;

        leftSide.position.set(buttonContainer.x - spacing, buttonContainer.y);
        rightSide.position.set(buttonContainer.x + spacing, buttonContainer.y);
    };

    return { sidesContainer, resizeSides };
};
