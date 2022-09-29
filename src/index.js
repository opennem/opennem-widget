import getChartOptions from "./modules/chart-options";
import drawChart from "./modules/chart";
import dataTransform from "./modules/data-transform";
import rollUp from "./modules/roll-up";
import { get7dPowerPath } from "./modules/json-paths"
import * as nemFts from "./modules/fuel-techs-nem";
import * as wemFts from "./modules/fuel-techs-wem";

const region = "NEM"; // or "WEM"
const fts = region === "NEM" ? nemFts : wemFts;
const regionLength = region === "NEM" ? 2017 : 337;
const is5Min = region === "NEM" ? true : false;
const useGW = region === "NEM" ? true : false;
const nemMaxY = useGW ? 33 : 33000;
const wemMaxY = useGW ? 3.3 : 3300;
const maxY = region === "NEM" ? nemMaxY : wemMaxY;
const showLast3Days = true
const chartOptions = getChartOptions("opennem-widget-chart");
const dataURL = get7dPowerPath(region);

fetch(dataURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonData) {
    const data = jsonData.data ? jsonData.data : jsonData;
    const dataset = dataTransform(data, regionLength, is5Min, fts, useGW, showLast3Days);
    if (dataset.length > 0) {
      drawChart(chartOptions, rollUp(dataset, fts.fuelTechIds), fts, maxY, useGW);
    } else {
      // display no NEM. Try again later
      console.log("There is no NEM or WEM data.");
    }
  });
