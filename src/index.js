import getChartOptions from "./modules/chart-options";
import drawChart from "./modules/chart";
import dataTransform from "./modules/data-transform";
import rollUp from "./modules/roll-up";
import { get7dPowerPath } from "./modules/json-paths"

const region = "WEM" // or "WEM"
const chartOptions = getChartOptions("opennem-widget-chart");
const dataURL = get7dPowerPath(region)

fetch(dataURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonData) {
    const data = jsonData.data ? jsonData.data : jsonData;
    const dataset = dataTransform(data, region);
    if (dataset.length > 0) {
      // drawChart(chartOptions, rollUp(dataset));
      drawChart(chartOptions, dataset);
    } else {
      // display no NEM. Try again later
      console.log("There is no NEM data.");
    }
  });
