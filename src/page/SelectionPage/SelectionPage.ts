import { Application, Assets, Sprite, Ticker } from "pixi.js";
import { createMainIcon } from "./components/MainIcon";
import { createGreetingText } from "./components/GreetingText";
import { createButton } from "./components/Button";
import { createButtonSides } from "./components/ButtonSides";
import { createChangingText } from "./components/ChangingText";

import BG from "/assets/SelectionPage/BG.png";

export const createSelectionPage = async (containerId: string, backgroundColor: string) => {
    const app = new Application();
    await app.init({ background: backgroundColor, resizeTo: window });

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }
    container.appendChild(app.canvas);

    const bgTexture = await Assets.load(BG);
    const bg = new Sprite(bgTexture);
    bg.anchor.set(0.5);

    const { icon, resizeIcon } = await createMainIcon();
    const { text, resizeText: resizeGreetingText } = await createGreetingText();
    const { buttonContainer, resizeButton } = await createButton();
    const { textContainer, updateText, resizeText: resizeChangingText } = await createChangingText();
    const { sidesContainer, resizeSides } = await createButtonSides(updateText);

    const resizeElements = () => {
        const { width, height } = app.screen;
        bg.position.set(width / 2, height / 2);
        bg.scale.set(Math.min(width / bg.texture.width, height / bg.texture.height, 1));

        resizeIcon(bg);
        resizeButton(bg);
        resizeSides(buttonContainer);
        resizeGreetingText(bg);
        resizeChangingText(bg);

        textContainer.position.set(bg.x, bg.y + bg.height / 6);
    };

    let resizeTimeout: number;
    const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => requestAnimationFrame(resizeElements), 100);
    };
    window.addEventListener("resize", onResize);

    app.stage.addChild(bg, icon, text, buttonContainer, sidesContainer, textContainer);

    const ticker = new Ticker();
    ticker.add(() => app.render());
    ticker.start();

    resizeElements();
};
