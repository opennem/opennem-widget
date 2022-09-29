import { timeParse } from "d3-time-format";
// import { isRoofSolar, isValidFuelTech, fuelTechs } from "./fuel-techs";
import { isRoofSolar, isValidFuelTech, fuelTechs } from "./fuel-techs-wem";
import newDataObj from "./new-data-obj";

function getDataPoint(data) {
  // look for black coal
  let dataPoint = data.find((d) => d.id === fuelTechs.black_coal);
  if (!dataPoint) {
    // if not found, use first point
    dataPoint = data[0];
  }
  return dataPoint;
}

export default function (data, region) {
  if (data.length > 0) {
    const length = region === "NEM" ? 2017 : 327;
    console.log('ength', length)
    let array = [];
    const dataPoint = getDataPoint(data);

    const sDate = dataPoint.history.start;
    const startDateString = sDate.substring(0, 16);
    const startDateTime = timeParse("%Y-%m-%dT%H:%M")(startDateString);

    const lDate = dataPoint.history.last;
    const lastDateString = lDate.substring(0, 16);
    const lastDateTime = timeParse("%Y-%m-%dT%H:%M")(lastDateString);
    const lastTime = lastDateTime.getTime();

    let startTime = startDateTime.getTime();

    console.log(startDateTime, lastDateTime)
    for (let i = 0; i < length; i++) {
      array.push(newDataObj(startTime));
      // startTime += 300000;
      startTime += 1.8e+6;
    }

    data.forEach(function (d) {
      if (isValidFuelTech(d.id)) {
        // if (isRoofSolar(d.id)) {
        //   // 30m interval
        //   var history = d.history.data;
        //   var rSolarIndex = 0;

        //   if (d.forecast) {
        //     // add forecast data
        //     history.push.apply(history, d.forecast.data);
        //   }
        //   for (let k = 0; k < length; k++) {
        //     array[k][d.id] =
        //       typeof history[rSolarIndex] === "undefined"
        //         ? 0
        //         : history[rSolarIndex] / 1000;

        //     if (k !== 0) {
        //       if (k % 6 === 0) {
        //         rSolarIndex += 1;
        //       }
        //     }
        //   }
        // } else {
        //   for (let j = 0; j < length; j++) {
        //     const value = d.history.data[j] ? d.history.data[j] / 1000 : 0;
        //     array[j][d.id] = value;
        //   }
        // }

        for (let j = 0; j < length; j++) {
          const value = d.history.data[j] ? d.history.data[j] : 0;
          array[j][d.id] = value;
        }
      }
    });

    if (array && array.length > 0) {
      const last3days = lastTime - 259200000;
      array = array.filter(function (a) {
        return a.time >= last3days;
      });
    }

    console.log(array)

    return array;
  } else {
    return [];
  }
}
