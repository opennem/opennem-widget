module.exports = function (ft) { 
  return ft === 'nem.fuel_tech.biomass.power' ||
    ft === 'nem.fuel_tech.black_coal.power' ||
    ft === 'nem.fuel_tech.brown_coal.power' ||
    ft === 'nem.fuel_tech.distillate.power' ||
    ft === 'nem.fuel_tech.gas_ccgt.power' ||
    ft === 'nem.fuel_tech.gas_ocgt.power' ||
    ft === 'nem.fuel_tech.gas_recip.power' ||
    ft === 'nem.fuel_tech.gas_steam.power' ||
    ft === 'nem.fuel_tech.hydro.power' ||
    ft === 'nem.fuel_tech.rooftop_solar.power' ||
    ft === 'nem.fuel_tech.solar.power' ||
    ft === 'nem.fuel_tech.wind.power' ||
    ft === 'nem.fuel_tech.battery_discharging.power';
}
