import { Container, Sprite, Assets, Ticker } from "pixi.js";
import EmptyStarTexture from "/assets/ErrorPage/components/Star.png";

interface AnimatedStar extends Sprite {
    animationSpeed: number;
    animationOffset: number;
}

export const createEmptyStars = async () => {
    const starsContainer = new Container();
    const starTexture = await Assets.load(EmptyStarTexture);
    const stars: AnimatedStar[] = [];
    
    for (let i = 0; i < 3; i++) {
        const star = new Sprite(starTexture) as AnimatedStar;
        star.anchor.set(0.5);
        star.scale.set(1);
        star.position.x = (i - 1) * star.width * 2;
        star.animationSpeed = 0.05;
        star.animationOffset = i * Math.PI * 0.5;
        star.alpha = 0.5;
        stars.push(star);
        starsContainer.addChild(star);
    }

    const globalTicker = Ticker.shared;
    let time = 0;
    
    const animate = () => {
        time += globalTicker.deltaTime / 60;
        stars.forEach(star => {
            const scale = 0.9 + Math.sin(time * 2 + star.animationOffset) * 0.1;
            star.scale.set(scale);
        });
    };

    globalTicker.add(animate);

    return {
        starsContainer,
        destroy: () => globalTicker.remove(animate)
    };
};
