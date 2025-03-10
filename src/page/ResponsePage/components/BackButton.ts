import { Sprite, Assets, Container } from "pixi.js";
import ButtonTexture from "/assets/ResponsePage/components/Group10.png";

export const createBackButton = async (onClick: () => void) => {
    const texture = await Assets.load(ButtonTexture);

    const buttonContainer = new Container();
    const button = new Sprite(texture);

    button.anchor.set(0.5); 
    button.roundPixels = true;

    buttonContainer.addChild(button);
    const resizeButton = (bg: Sprite) => {
        const scaleFactor = Math.min(bg.width / 10 / button.texture.width, 2);
        button.scale.set(scaleFactor);
    
        buttonContainer.position.set(bg.x, bg.y + bg.height / 3);
    };
    

    button.eventMode = "static";
    button.cursor = "pointer";
    button.on("pointerup", onClick);

    return { buttonContainer, resizeButton };
};
