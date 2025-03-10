import { Application } from "pixi.js";
import { createSelectionPage } from "./page/SelectionPage/SelectionPage";
import { createResponsePage } from "./page/ResponsePage/ResponsePage";

const backgroundColor = "#39373a";
const containerId = "pixi-container";

const transition = async (oldApp: Application | null, createNewPage: () => Promise<Application>) => {
    if (oldApp) {
        const fadeOut = async () => {
            for (let alpha = 1; alpha >= 0; alpha -= 0.05) {
                oldApp.stage.alpha = alpha;
                await new Promise(resolve => setTimeout(resolve, 16));
            }
        };
        await fadeOut();
    }

    document.getElementById(containerId)!.innerHTML = "";
    const newApp = await createNewPage();

    // Fade in
    newApp.stage.alpha = 0;
    const fadeIn = async () => {
        for (let alpha = 0; alpha <= 1; alpha += 0.05) {
            newApp.stage.alpha = alpha;
            await new Promise(resolve => setTimeout(resolve, 16));
        }
    };
    await fadeIn();
    
    return newApp;
};

let currentApp: Application | null = null;

const loadPage = async () => {
    const route = window.location.hash;
    try {
        if (route === "#response") {
            currentApp = await transition(currentApp, () => 
                createResponsePage(containerId, backgroundColor));
        } else {
            currentApp = await transition(currentApp, () => 
                createSelectionPage(containerId, backgroundColor));
        }
    } catch (error) {
        console.error('Failed to load page:', error);
    }
};

document.addEventListener("DOMContentLoaded", loadPage);
window.addEventListener("hashchange", loadPage);
