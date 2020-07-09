import {
  setup,
  drawTitle,
  drawXAxisGrid,
  drawXAxisText,
  drawYAxis,
  drawStackedAreaHover,
  drawHover,
} from "./chart-functions";

export default function (viz, data) {
  console.log(viz, data);
  setup(viz, data);
  drawTitle(viz);
  drawXAxisText(viz);
  drawStackedAreaHover(viz, data);
  drawXAxisGrid(viz);
  drawYAxis(viz);
}
