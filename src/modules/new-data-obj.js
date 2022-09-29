export default function (time, fuelTechIds) {
  const obj = {};

  obj.date = new Date(time);
  obj.time = time;

  fuelTechIds.forEach((id) => {
    obj[id] = 0;
  });

  return obj;
}
