import { Text, TextStyle, Container, Sprite, FederatedPointerEvent, Graphics, Assets } from "pixi.js";
import TextBgPath from "/assets/ResponsePage/components/Rectangle4.png";
import ArrowsTexture from "/assets/ResponsePage/components/Group7.png";

export const createTextInsideBackground = async () => {
    const bgTexture = await Assets.load(TextBgPath);
    const bg = new Sprite(bgTexture);
    bg.anchor.set(0.5);
    bg.scale.set(1.2);

    const textStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0x000000,
        wordWrap: true,
        wordWrapWidth: bg.width * 0.8,
        align: "left",
        leading: 3
    });

    const textContent = `Почему вообще люди ждут конца света? И почему, если таковой предстоит, он обязательно
должен быть для большинства человеческого рода
ужасным?.. Ответ на первый вопрос состоит, по-видимому,
в том, что существование мира, как подсказывает
людям разум, имеет ценность лишь постольку,
поскольку разумные существа соответствуют
в нем конечной цели своего бытия;
если же последняя оказывается недостижимой, то
сотворенное бытие теряет в их глазах смысл, как
спектакль без развязки и замысла.
Ответ на второй вопрос основывается на мнении
о безнадежной испорченности человеческого рода,
ужасный конец которого представляется
подавляющему большинству людей единственно
соответствующим высшей мудрости и справедливости.`;

    const text = new Text({
        text: textContent,
        style: textStyle
    });

    const mask = new Graphics();
    mask.beginFill(0xFFFFFF);
    mask.drawRect(0, 0, bg.width * 0.9, bg.height * 0.9);
    mask.endFill();

    const scrollContainer = new Container();
    scrollContainer.addChild(text);
    
    const textContainer = new Container();
    textContainer.addChild(bg);
    textContainer.addChild(scrollContainer);

    text.position.set(-bg.width * 0.45, -bg.height * 0.45);

    scrollContainer.mask = mask;
    mask.position.set(-bg.width * 0.45, -bg.height * 0.45);
    textContainer.addChild(mask);

    const scrollbar = new Container();
    
    const arrowsTexture = await Assets.load(ArrowsTexture);
    const upArrow = new Sprite(arrowsTexture);
    const downArrow = new Sprite(arrowsTexture);
    
    upArrow.anchor.set(0.5);
    downArrow.anchor.set(0.5);
    downArrow.angle = 180;

    const arrowScale = 1.5;
    upArrow.scale.set(arrowScale);
    downArrow.scale.set(arrowScale);

    const scrollbarBg = new Graphics()
        .beginFill(0xEEEEEE)
        .drawRoundedRect(-15, 0, 30, bg.height * 0.9, 15)
        .endFill();

    const scrollThumb = new Graphics()
        .beginFill(0x666666)
        .drawRoundedRect(-10, 0, 20, 70, 10)
        .endFill();

    upArrow.position.set(0, upArrow.height/2 + 15);
    downArrow.position.set(0, bg.height * 0.9 - downArrow.height/2 - 15);

    scrollbar.addChild(scrollbarBg);    
    scrollbar.addChild(scrollThumb);     
    scrollbar.addChild(upArrow);         
    scrollbar.addChild(downArrow);

    scrollbar.position.set(bg.width * 0.42, -bg.height * 0.45); 

    upArrow.eventMode = 'static';
    downArrow.eventMode = 'static';
    upArrow.cursor = 'pointer';
    downArrow.cursor = 'pointer';

    const scrollStep = 20;

    const updateScrollThumb = () => {
        const contentHeight = text.height;
        const viewportHeight = bg.height * 0.9;
        const scrollPercent = Math.abs((text.position.y + bg.height * 0.45) / (contentHeight - viewportHeight));
        const maxScrollThumbY = bg.height * 0.9 - scrollThumb.height - upArrow.height * 2 - 20;
        scrollThumb.y = upArrow.height + 10 + Math.max(0, Math.min(maxScrollThumbY, scrollPercent * maxScrollThumbY));
    };

    const updateScrollPosition = (newY: number) => {
        const minY = -bg.height * 0.45;
        const maxY = minY - (text.height - bg.height * 0.9);
        text.position.y = Math.max(maxY, Math.min(minY, newY));
        updateScrollThumb();
    };

    upArrow.on('pointerdown', () => updateScrollPosition(text.position.y + scrollStep));
    downArrow.on('pointerdown', () => updateScrollPosition(text.position.y - scrollStep));

    scrollThumb.eventMode = 'static';
    scrollThumb.cursor = 'pointer';

    let isDraggingThumb = false;
    let startThumbY = 0;
    let isDragging = false;
    let startY = 0;
    let previousY = 0;

    scrollThumb.on('pointerdown', (e: FederatedPointerEvent) => {
        isDraggingThumb = true;
        startThumbY = e.global.y - scrollThumb.y;
    });

    scrollThumb.on('globalpointermove', (e: FederatedPointerEvent) => {
        if (isDraggingThumb) {
            const newThumbY = e.global.y - startThumbY;
            const maxScrollThumbY = bg.height * 0.9 - scrollThumb.height - upArrow.height * 2 - 20;
            const minThumbY = upArrow.height + 10;
            const thumbPosition = Math.max(minThumbY, Math.min(minThumbY + maxScrollThumbY, newThumbY));
            scrollThumb.y = thumbPosition;

            const scrollPercent = (thumbPosition - minThumbY) / maxScrollThumbY;
            const contentHeight = text.height;
            const viewportHeight = bg.height * 0.9;
            const newTextY = -bg.height * 0.45 - scrollPercent * (contentHeight - viewportHeight);
            text.position.y = Math.max(-bg.height * 0.45 - (contentHeight - viewportHeight), 
                                     Math.min(-bg.height * 0.45, newTextY));
        }
    });

    scrollThumb.on('pointerup', () => isDraggingThumb = false);
    scrollThumb.on('pointerupoutside', () => isDraggingThumb = false);

    scrollContainer.eventMode = 'static';
    scrollContainer.cursor = 'pointer';

    scrollContainer.on('pointerdown', (e: FederatedPointerEvent) => {
        isDragging = true;
        startY = e.global.y;
        previousY = text.position.y;
    });

    scrollContainer.on('pointermove', (e: FederatedPointerEvent) => {
        if (isDragging) {
            const deltaY = e.global.y - startY;
            updateScrollPosition(previousY + deltaY);
        }
    });

    scrollContainer.on('wheel', (e: WheelEvent) => {
        e.preventDefault();
        updateScrollPosition(text.position.y - e.deltaY);
    });

    scrollContainer.on('pointerup', () => isDragging = false);
    scrollContainer.on('pointerupoutside', () => isDragging = false);

    updateScrollThumb();
    textContainer.addChild(scrollbar);

    return textContainer;
};
