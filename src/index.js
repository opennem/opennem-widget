import getChartOptions from "./modules/chart-options";
import drawChart from "./modules/chart";
import dataTransform from "./modules/data-transform";
import rollUp from "./modules/roll-up";

const chartOptions = getChartOptions("opennem-widget-chart");
const dataURL = "https://data.opennem.org.au/v3/stats/au/NEM/power/7d.json"

fetch(dataURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonData) {
    const data = jsonData.data ? jsonData.data : jsonData;
    const dataset = dataTransform(data);
    if (dataset.length > 0) {
      drawChart(chartOptions, rollUp(dataset));
    } else {
      // display no NEM. Try again later
      console.log("There is no NEM data.");
    }
  });
