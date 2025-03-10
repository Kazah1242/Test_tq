import { Container, Sprite, Assets, Ticker } from "pixi.js";
import StarTexture from "/assets/ResponsePage/components/StarFill.png";

interface AnimatedStar extends Sprite {
    animationSpeed: number;
    animationOffset: number;
}

export const createStars = async () => {
    const starsContainer = new Container();
    const starTexture = await Assets.load(StarTexture);
    const stars: AnimatedStar[] = [];
    
    for (let i = 0; i < 3; i++) {
        const star = new Sprite(starTexture) as AnimatedStar;
        star.anchor.set(0.5);
        star.scale.set(1);
        star.position.x = (i - 1) * star.width * 2;
        star.animationSpeed = 0.05;
        star.animationOffset = i * Math.PI * 0.5;
        stars.push(star);
        starsContainer.addChild(star);
    }

    const globalTicker = Ticker.shared;
    let time = 0;
    
    const animate = () => {
        time += globalTicker.deltaTime / 60;
        stars.forEach(star => {
            const scale = 0.9 + Math.sin(time * 2 + star.animationOffset) * 0.2;
            const alpha = 0.6 + Math.sin(time + star.animationOffset) * 0.4;
            star.scale.set(scale);
            star.alpha = alpha;
        });
    };

    globalTicker.add(animate);

    return {
        starsContainer,
        resizeStars: (bg: Sprite) => {
            starsContainer.position.set(bg.x, bg.y - bg.height * 0.15);
            starsContainer.scale.set(bg.scale.x * 0.9);
        },
        destroy: () => globalTicker.remove(animate)
    };
};
