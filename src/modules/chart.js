import {
  setup,
  drawTitle,
  drawXAxis,
  drawYAxis,
  drawStackedArea,
  drawHover,
} from "./chart-functions";

export default function (viz, data) {
  console.log(viz, data);
  setup(viz, data);
  drawTitle(viz);
  drawStackedArea(viz, data);
  drawXAxis(viz);
  drawYAxis(viz);
  drawHover(viz);
}
