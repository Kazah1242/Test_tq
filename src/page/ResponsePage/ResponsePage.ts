import { Application, Assets, Sprite } from "pixi.js";
import { createMainIcon } from "@components/MainIcon/MainIcon";
import { createGreetingText } from "@components/GreetingText/GreetingText";    
import { createBackButton } from "@components/BackButton/BackButton";
import { createTextInsideBackground } from "./components/TextInsideBackground";  
import { createStars } from "./components/Stars";
import BG from "/assets/ResponsePage/BG.png"; 

export const createResponsePage = async (containerId: string, backgroundColor: string): Promise<Application> => {
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
        createStars()
    ]);

    const bg = new Sprite(bgTexture);
    bg.anchor.set(0.5);
    icon.angle = 180;

    const { text, resizeText: resizeGreetingText } = await createGreetingText();
    const { buttonContainer: backButtonContainer, resizeButton } = await createBackButton(() => {
        destroyStars();
        window.location.href = "#selection";
    });

    const textInsideBackground = await createTextInsideBackground();

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

        if (textInsideBackground) {
            textInsideBackground.position.set(bg.x, bg.y + bg.height * 0.1);
            textInsideBackground.scale.set(scale * 0.9);
        }

        backButtonContainer.position.set(
            bg.x - backButtonContainer.width / 2,
            bg.y + bg.height * 0.5
        );
        resizeButton(bg);
    };

    const debouncedResize = () => {
        requestAnimationFrame(resizeElements);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });

    const elements = [bg, icon, starsContainer, text, textInsideBackground, backButtonContainer];
    if (elements.every(Boolean)) {
        app.stage.addChild(...elements);
    }

    app.ticker.add(app.render, app);
    resizeElements();
    
    return app;
};