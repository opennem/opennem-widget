import {
  setup,
  drawTitle,
  drawXAxisGrid,
  drawXAxisText,
  drawYAxis,
  drawStackedAreaHover,
  resize,
} from "./chart-functions";

export default function (viz, data) {
  setup(viz, data);
  drawTitle(viz, data);
  drawXAxisText(viz);
  drawStackedAreaHover(viz, data);
  drawXAxisGrid(viz);
  drawYAxis(viz);

  window.addEventListener("resize", () => {
    resize(viz, data);
  });
}
