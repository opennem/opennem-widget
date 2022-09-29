import { nest } from "d3-collection";
import { mean } from "d3-array";

export default function (data, fuelTechIds) {
  var coeff = 1000 * 60 * 30; // roll up to 30mins
  var entries = nest()
    .key(function (d) {
      return Math.round(d.time / coeff) * coeff;
    })
    .rollup(function (a) {
      var obj = {};

      fuelTechIds.forEach(function (id) {
        obj[id] = mean(a, function (d) {
          return d[id];
        });
      });

      return obj;
    })
    .entries(data);

  return entries;
}
