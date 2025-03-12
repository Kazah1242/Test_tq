import { Assets, Text, TextStyle, Container, Sprite } from "pixi.js";
import AlumniSans from "/assets/Fonts/AlumniSans.ttf";
import gsap from "gsap";

export const createChangingText = async () => {
    await Assets.load(AlumniSans);

    const textContainer = new Container();

    const textStyle = new TextStyle({
        fontFamily: "AlumniSans",
        fontSize: 64,
        fill: "#39373A",
        align: "center",
    });

    const text = new Text({ 
        text: "я диспетчер", 
        style: textStyle 
    });
    text.anchor.set(0.5);
    text.resolution = window.devicePixelRatio;
    text.roundPixels = true;

    textContainer.addChild(text);

    const options = ["я диспетчер", "а что это значит?"];
    let currentIndex = 0;

    const updateText = (direction: "left" | "right") => {
        const xOffset = direction === "left" ? 50 : -50;
        
        gsap.to(text, {
            alpha: 0,
            x: -xOffset,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                currentIndex = (direction === "left")
                    ? (currentIndex - 1 + options.length) % options.length
                    : (currentIndex + 1) % options.length;
                text.text = options[currentIndex];
                
                text.x = xOffset;
                
                gsap.to(text, {
                    alpha: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    };

    const getCurrentText = () => options[currentIndex];

    const resizeText = (bg: Sprite) => {
        if (!bg) return;

        const scaleFactor = Math.min(bg.width / 8, bg.height / 10);
        text.style.fontSize = Math.max(0, scaleFactor);

        textContainer.position.set(bg.x, bg.y + bg.height / 10);
        text.position.set(0, -50);
    };

    return { textContainer, updateText, resizeText, getCurrentText };
};
