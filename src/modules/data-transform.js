var addMinutes = require('date-fns/add_minutes');
var subMinutes = require('date-fns/sub_minutes');
var isAfter = require('date-fns/is_after');
var dateFormat = require('date-fns/format');

var supportedFuelTech = require('./supported-fuel-tech.js');
var isRoofSolar = require('./solar-roof.js');
var newEmptyObj = require('./setup-data-obj.js');

module.exports = function (data) { 
  console.log(data);

  var length = 2016;
  var array = [];
  // var startDate = moment(data[0].history.start);
  var sDate = data[0].history.start;
  var lDate = data[0].history.last;

  for (var i=0; i < length; i++) {
    // array.push(newEmptyObj(startDate.toDate()));
    array.push(newEmptyObj(dateFormat(sDate)));
    // startDate.add(5, 'minutes');
    sDate = addMinutes(sDate, 5);
  }

  data.forEach(function(d) {
    if (supportedFuelTech(d.id)) {
      // d.history.data.forEach(function(point, index) {
      //   array[index][d.id] = point;
      // });

      if (isRoofSolar(d.id)) {
        // 30m interval
        var rSolarIndex = 0;
        for (var k=0; k < length; k++) {
          array[k][d.id] = (typeof d.history.data[rSolarIndex] === 'undefined') ? 0 : d.history.data[rSolarIndex];

          if (k !== 0) {
            if ((k % 6) === 0) {
              rSolarIndex += 1;
            }
          }
        }
      } else {
        for (var j=0; j < length; j++) {
          array[j][d.id] = d.history.data[j];
        }
      }
    }
  });

  lDate = subMinutes(lDate, 4320);
  var newArray = array.filter(function(d) {
    return isAfter(new Date(d.date), lDate);
  });

  return newArray;
}
