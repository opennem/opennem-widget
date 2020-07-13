// this also define the stack order
export const fuelTechs = {
  rooftop_solar: "nem.fuel_tech.rooftop_solar.power",
  solar: "nem.fuel_tech.solar.power",
  wind: "nem.fuel_tech.wind.power",
  hydro: "nem.fuel_tech.hydro.power",
  battery_discharging: "nem.fuel_tech.battery_discharging.power",
  gas_recip: "nem.fuel_tech.gas_recip.power",
  gas_ocgt: "nem.fuel_tech.gas_ocgt.power",
  gas_ccgt: "nem.fuel_tech.gas_ccgt.power",
  gas_steam: "nem.fuel_tech.gas_steam.power",
  distillate: "nem.fuel_tech.distillate.power",
  biomass: "nem.fuel_tech.biomass.power",
  black_coal: "nem.fuel_tech.black_coal.power",
  brown_coal: "nem.fuel_tech.brown_coal.power",
};

export const fuelTechLabels = {
  biomass: "Biomass",
  black_coal: "Black Coal",
  brown_coal: "Brown Coal",
  distillate: "Distillate",
  gas_ccgt: "Gas (CCGT)",
  gas_ocgt: "Gas (OCGT)",
  gas_recip: "Gas (Reciprocating)",
  gas_steam: "Gas (Steam)",
  hydro: "Hydro",
  rooftop_solar: "Solar (Rooftop)",
  solar: "Solar (Utility)",
  wind: "Wind",
  battery_discharging: "Battery (Discharging)",
};

export const fuelTechColours = {
  biomass: "#A3886F",
  black_coal: "#121212",
  brown_coal: "#8B572A",
  distillate: "#F35020",
  gas_ccgt: "#FDB462",
  gas_ocgt: "#FFCD96",
  gas_recip: "#F9DCBC",
  gas_steam: "#F48E1B",
  hydro: "#4582B4",
  rooftop_solar: "#F8E71C",
  solar: "#DFCF00",
  wind: "#417505",
  battery_discharging: "#00A2FA",
};

export const fuelTechKeys = Object.keys(fuelTechs);

export const fuelTechIds = (function () {
  return fuelTechKeys.map((k) => fuelTechs[k]).reverse();
})();
export const fuelTechIdColours = (function () {
  const obj = {};
  fuelTechKeys.forEach((key) => {
    obj[fuelTechs[key]] = fuelTechColours[key];
  });
  return obj;
})();

export function getLabelById(id) {
  let label = "";
  fuelTechKeys.forEach((key) => {
    if (fuelTechs[key] === id) {
      label = fuelTechLabels[key];
    }
  });
  return label;
}

export function getColourById(id) {
  let colour = "";
  fuelTechKeys.forEach((key) => {
    if (fuelTechs[key] === id) {
      colour = fuelTechColours[key];
    }
  });
  return colour;
}

export function isRoofSolar(id) {
  return id === fuelTechs.rooftop_solar;
}

export function isValidFuelTech(id) {
  let isValid = false;
  fuelTechKeys.forEach((k) => {
    if (fuelTechs[k] === id) {
      isValid = true;
    }
  });
  return isValid;
}
