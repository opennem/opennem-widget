import { timeParse } from "d3-time-format";
import newDataObj from "./new-data-obj";

function getDataPoint(data, fts) {
  // look for black coal
  let dataPoint = data.find((d) => d.id === fts.fuelTechs.black_coal); // exists in NEM and WEM
  if (!dataPoint) {
    // if not found, use first point
    dataPoint = data[0];
  }
  return dataPoint;
}

export default function (data, length, is5min, fts, useGW, showLast3Days) {
  if (data.length > 0) {
    let array = [];
    const dataPoint = getDataPoint(data, fts);

    const sDate = dataPoint.history.start;
    const startDateString = sDate.substring(0, 16);
    const startDateTime = timeParse("%Y-%m-%dT%H:%M")(startDateString);

    const lDate = dataPoint.history.last;
    const lastDateString = lDate.substring(0, 16);
    const lastDateTime = timeParse("%Y-%m-%dT%H:%M")(lastDateString);
    const lastTime = lastDateTime.getTime();

    let startTime = startDateTime.getTime();

    function mutateArray(arr, d) {
      for (let j = 0; j < length; j++) {
        const value = d.history.data[j] ? useGW ? d.history.data[j] / 1000 : d.history.data[j] : 0;
        arr[j][d.id] = value;
      }
    }

    for (let i = 0; i < length; i++) {
      array.push(newDataObj(startTime, fts.fuelTechIds));
      startTime += is5min ? 300000 : 1800000;
    }

    data.forEach(function (d) {
      if (fts.isValidFuelTech(d.id)) {

        if (is5min) {
          // for NEM data

          if (fts.isRoofSolar(d.id)) {
            // 30m interval
            var history = d.history.data;
            var rSolarIndex = 0;
  
            if (d.forecast) {
              // add forecast data
              history.push.apply(history, d.forecast.data);
            }
            for (let k = 0; k < length; k++) {
              array[k][d.id] =
                typeof history[rSolarIndex] === "undefined"
                  ? 0
                  : useGW ? history[rSolarIndex] / 1000 : history[rSolarIndex];
  
              if (k !== 0) {
                if (k % 6 === 0) {
                  rSolarIndex += 1;
                }
              }
            }
          } else {
            mutateArray(array, d)
          }

        } else {
          mutateArray(array, d)
        }
      }
    });

    if (showLast3Days && array && array.length > 0) {
      const last3days = lastTime - 259200000;
      array = array.filter(function (a) {
        return a.time >= last3days;
      });
    }

    return array;
  } else {
    return [];
  }
}
