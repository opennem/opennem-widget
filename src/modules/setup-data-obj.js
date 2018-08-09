module.exports = function (date) { 
  var obj = {};

  obj.date = date;
  obj['nem.fuel_tech.brown_coal.power'] = 0;
  obj['nem.fuel_tech.black_coal.power'] = 0;
  obj['nem.fuel_tech.biomass.power'] = 0;
  obj['nem.fuel_tech.distillate.power'] = 0;
  obj['nem.fuel_tech.battery_discharging.power'] = 0;
  obj['nem.fuel_tech.hydro.power'] = 0;
  obj['nem.fuel_tech.gas_steam.power'] = 0;
  obj['nem.fuel_tech.gas_ccgt.power'] = 0;
  obj['nem.fuel_tech.gas_ocgt.power'] = 0;
  obj['nem.fuel_tech.gas_recip.power'] = 0;
  obj['nem.fuel_tech.wind.power'] = 0;
  obj['nem.fuel_tech.solar.power'] = 0;
  obj['nem.fuel_tech.rooftop_solar.power'] = 0;

  return obj;
}
