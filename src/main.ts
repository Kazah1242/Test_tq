import { createSelectionPage } from "./page/SelectionPage/SelectionPage";

document.addEventListener("DOMContentLoaded", () => {
  const backgroundColor = "#39373a"; // Вынесенный цвет фона
  createSelectionPage("pixi-container", backgroundColor);
});
