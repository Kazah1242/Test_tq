import { Application, Assets, Sprite } from "pixi.js";
import { createMainIcon } from "@components/MainIcon/MainIcon";
import { createGreetingText } from "@components/GreetingText/GreetingText";    
import { createBackButton } from "@components/BackButton/BackButton";
import { createEmptyStars } from "./components/EmptyStars";
import { createErrorText } from "./components/ErrorText";
import BG from "/assets/ErrorPage/BG.png"; 

export const createErrorPage = async (containerId: string, backgroundColor: string): Promise<Application> => {
    const app = new Application();
    await app.init({ background: backgroundColor, resizeTo: window });
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container with ID "${containerId}" not found.`);
    }
    container.appendChild(app.canvas);

    const [bgTexture, { icon, resizeIcon }, { starsContainer, destroy: destroyStars }] = await Promise.all([
        Assets.load(BG),
        createMainIcon(),
        createEmptyStars()
    ]);

    const bg = new Sprite(bgTexture);
    bg.anchor.set(0.5);
    icon.angle = 180;

    const { text, resizeText: resizeGreetingText } = await createGreetingText();
    const { textContainer: errorTextContainer, resizeText: resizeErrorText } = await createErrorText();
    const { buttonContainer: backButtonContainer, resizeButton } = await createBackButton(() => {
        destroyStars();
        window.location.href = "#selection";
    });

    const resizeElements = () => {
        const { width, height } = app.screen;
        const scale = Math.min(width / bg.texture.width, height / bg.texture.height, 1);
        
        bg.position.set(width / 2, height / 2);
        bg.scale.set(scale);

        resizeIcon(bg);
        icon.y -= bg.height * 0.05;

        starsContainer.position.set(bg.x, bg.y - bg.height * 0.165);
        starsContainer.scale.set(scale * 0.9);

        resizeGreetingText(bg);
        resizeErrorText(bg);

        backButtonContainer.position.set(
            bg.x - backButtonContainer.width / 2,
            bg.y + bg.height * 0.5
        );
        resizeButton(bg);
    };

    window.addEventListener("resize", () => {
        requestAnimationFrame(resizeElements);
    }, { passive: true });

    const elements = [bg, icon, starsContainer, text, errorTextContainer, backButtonContainer];
    if (elements.every(Boolean)) {
        app.stage.addChild(...elements);
    }

    app.ticker.add(app.render, app);
    resizeElements();
    
    return app;
};
