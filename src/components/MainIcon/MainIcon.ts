import { Assets, Sprite, Ticker } from "pixi.js";
import MainIcon from "/assets/MainIcon/MainIcon.png";

export async function createMainIcon() {
  const texture = await Assets.load(MainIcon);
  const icon = new Sprite(texture);

  icon.anchor.set(0.5);

  function resizeIcon(bg: Sprite) {
    icon.position.set(bg.x, bg.y - bg.height / 3.5);
    const scaleFactor = bg.width / 4 / icon.texture.width;
    icon.scale.set(scaleFactor);
  }

  let elapsed: number = 0;
  const ticker = new Ticker();

  ticker.add((ticker: Ticker) => {
    elapsed += ticker.deltaTime / 12;
    icon.y += Math.sin(elapsed) * 0.5;
  });

  ticker.start();

  let isRotating = false;
  let rotationProgress = 0;
  const rotationSpeed = 0.1;
  const fullRotation = Math.PI * 2;

  const rotationTicker = new Ticker();
  rotationTicker.add(() => {
    if (isRotating) {
      icon.rotation += rotationSpeed;
      rotationProgress += rotationSpeed;

      if (rotationProgress >= fullRotation) {
        isRotating = false;
        rotationProgress = 0;
      }
    }
  });

  rotationTicker.start();

  icon.eventMode = "static";
  icon.on("pointerdown", () => {
    if (!isRotating) {
      isRotating = true;
      rotationProgress = 0;
    }
  });

  return { icon, resizeIcon };
}
