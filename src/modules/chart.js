import {
  setup,
  drawTitle,
  drawXAxisGrid,
  drawXAxisText,
  drawYAxis,
  drawStackedAreaHover,
  resize,
} from "./chart-functions";

export default function (viz, data, fuelTechs, maxY, useGW) {
  const unit = useGW ? "GW" : "MW";
  setup(viz, data, fuelTechs, maxY);
  drawTitle(viz, data, unit);
  drawXAxisText(viz);
  drawStackedAreaHover(viz, data, fuelTechs, unit);
  drawXAxisGrid(viz);
  drawYAxis(viz);

  window.addEventListener("resize", () => {
    resize(viz, data, fuelTechs);
  });
}
