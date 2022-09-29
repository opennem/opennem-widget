// this also define the stack order
export const fuelTechs = {
  rooftop_solar: "au.wem.fuel_tech.solar_rooftop.power",
  solar: "au.wem.fuel_tech.solar_utility.power",
  wind: "au.wem.fuel_tech.wind.power",
  gas_ocgt: "au.wem.fuel_tech.gas_ocgt.power",
  gas_ccgt: "au.wem.fuel_tech.gas_ccgt.power",
  bioenergy_biogas: "au.wem.fuel_tech.bioenergy_biogas.power",
  black_coal: "au.wem.fuel_tech.coal_black.power",
};

export const fuelTechLabels = {
  bioenergy_biogas: "Bioenergy (Biogas)",
  black_coal: "Black Coal",
  gas_ccgt: "Gas (CCGT)",
  gas_ocgt: "Gas (OCGT)",
  rooftop_solar: "Solar (Rooftop)",
  solar: "Solar (Utility)",
  wind: "Wind",
};

export const fuelTechColours = {
  bioenergy_biogas: "#1D7A7A",
  black_coal: "#121212",
  gas_ccgt: "#FDB462",
  gas_ocgt: "#FFCD96",
  rooftop_solar: "#F8E71C",
  solar: "#DFCF00",
  wind: "#417505",
};

export const fuelTechRenewables = {
  bioenergy_biogas: true,
  black_coal: false,
  gas_ccgt: false,
  gas_ocgt: false,
  rooftop_solar: true,
  solar: true,
  wind: true,
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

export function isRenewable(id) {
  let renewable = false;
  fuelTechKeys.forEach((key) => {
    if (fuelTechs[key] === id) {
      renewable = fuelTechRenewables[key];
    }
  });
  return renewable;
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
