import { fuelTechIds } from "./fuel-techs";

export default function (time) {
  const obj = {};

  obj.date = new Date(time);
  obj.time = time;

  fuelTechIds.forEach((id) => {
    obj[id] = 0;
  });

  return obj;
}
