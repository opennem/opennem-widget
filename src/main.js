var d3 = Object.assign({},
  require("d3-selection"),
  require("d3-transition"),
  require("d3-time-format"),
  require("d3-collection"),
  require("d3-scale"),
  require("d3-array"),
  require("d3-shape"),
  require("d3-axis"),
);

// INITIALS MODULES AND VARS
var dateFormat = require('date-fns/format');
var colours = require('./modules/chart-colours.js');
var transform = require('./modules/data-transform.js');
var fuelTechIds = require('./modules/fuel-tech-ids.js');
var fuelTechLabels = require('./modules/fuel-tech-labels.js');

var formatTime = d3.timeFormat("%e %b, %H:%M");
var windowWidth = window.innerWidth > 600 ? 590 : window.innerWidth-10;
var margin = {top: 1, right: 2, bottom: 20, left: 2};
var width = windowWidth - margin.left - margin.right;
var height = 220 - margin.top - margin.bottom;
var svg = d3.select("#chart")
  .append("svg")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scaleTime()
  .rangeRound([0, width]);
var y = d3.scaleLinear()
  .rangeRound([height, 0]);
var z = d3.scaleOrdinal(colours);
var stack = d3.stack();
var area = d3.area()
  .curve(d3.curveBasis)
  .x(function(d, i) { return x(d3.isoParse(d.data.key)); })
  .y0(function(d) { return y(d[0]); })
  .y1(function(d) { return y(d[1]); });


function setupLegend() {
  var legendTable = document.getElementById("legend-table");
  legendTable.style.display = 'none';
  document.getElementById("legend-toggle").onclick = function() {
    var currentDisplay = legendTable.style.display;
    if (currentDisplay === 'none') {
      legendTable.style.display = 'block';
    } else {
      legendTable.style.display = 'none';
    }
  }
}

function rollupTo30Mins(data) {
  var coeff = 1000 * 60 * 30;
  var entries = d3.nest()
    .key(function(d) { return dateFormat(Math.round(new Date(d.date).getTime() / coeff) * coeff)})
    .rollup(function(a) {
      var obj = {};

      fuelTechIds.forEach(function(id) {
        obj[id] = d3.mean(a, function(d) { return d[id] });
      });
      
      return obj;
    })
    .entries(data);
  
  return entries;
}

function getData() {
  fetch('https://data.opennem.org.au/power/nem.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonData) {
    var data5min = transform(jsonData);
    var keys = Object.keys(data5min[0]);
    var data = rollupTo30Mins(data5min);

    keys.shift(); // remove 'date'
    x.domain(d3.extent(data, function(d) { return d3.isoParse(d.key); }));
    y.domain([0, 33000]);
    z.domain(keys);
    stack
      .keys(keys)
      .value(function value(d, key) {
        return d.value[key];
      });
    
    g.append("text")
      .attr("class", "title")
      .text('Generation MW')
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1.5em")
      .attr("dx", ".5em")
      .style("font-size", 10);

    var mouseGroup = g.append('g').attr('class', 'mouse-group');

    var layer = g.selectAll(".layer")
      .data(stack(data))
      .enter().append("g")
        .attr("class", "layer");
    
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(3).tickSize(-height).tickFormat((function(d) {
        var currentHour = d.getHours();
        var currentMinute = d.getMinutes();
        var dayFormat = d3.timeFormat("%_d %b");
        var timeFormat = d3.timeFormat("%H:%M");
        var formatted = timeFormat(d);

        if (currentHour === 0 && currentMinute === 0) {
          formatted = dayFormat(d);
        }
        return formatted;
      })))
      .selectAll("text")
        .attr("y", 6)
        .attr("x", 6)
        .style("text-anchor", "start");
    
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(4).tickSize(-width))
      .selectAll("text")
        .attr("y", -6)
        .attr("x", 6)
        .style("text-anchor", "start");

    mouseGroup.append('g')
      .append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#c74523")
      .style("stroke-width", "1px")
        
    var tooltip = mouseGroup.append("g")
      .attr("class", "tooltip")
      .style("opacity", "0");

    tooltip.append("text")
      .attr("class", "date")
      .text('')
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1.3em")
      .attr("dx", ".5em")
      .style("font-size", 10);

    var valueWrapper = tooltip.append("g")
      .attr("class", "value-wrapper")
    
    valueWrapper.append('rect')
      .style("width", width+"px")
      .style("height", "18px")
      .style("opacity", ".3")
      .attr('fill', '#999')
    
    valueWrapper.append("text")
      .attr("class", "value")
      .text('')
      .attr("x", width)
      .attr("y", 0)
      .attr("dy", "1.3em")
      .attr("dx", "-.5em")
      .style("text-anchor", "end")
      .style("font-size", 10);

    layer.append("path")
      .attr("class", "area")
      .style("fill", function(d) { return z(d.key); })
      .attr("d", area);
    
    layer.attr("opacity", 1)
      .on("mouseover", function(d, i) {
        d3.select(".title")
          .style("opacity", "0");

        svg.selectAll(".layer").transition()
          .duration(100)
          .attr("opacity", '.85');

        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.select(".tooltip")
          .style("opacity", "1");
      })
      .on("mouseout", function(d, i) {
        d3.select(".title")
          .style("opacity", "1");
        svg.selectAll(".layer").transition()
          .duration(100)
          .attr("opacity", "1");
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.select(".tooltip")
          .style("opacity", "0");
      })
      .on('mousemove', function(d) { // mouse moving over canvas
        var mouse = d3.mouse(this);

        var bisectDate = d3.bisector(function(d) {
          return d3.isoParse(d.date);
        }).left;

        var xDate = x.invert(mouse[0]);
        var i = bisectDate(data5min, xDate, 1);
        var d0 = data5min[i - 1];
        var d1 = data5min[i];
        var xDateData = xDate - d0.date > d1.date - xDate ? d1 : d0;
        var hoverFuelTech = d.key;

        d3.select('.tooltip .date').text(formatTime(d3.isoParse(xDateData.date)));
        d3.select('.tooltip .value').text(fuelTechLabels[hoverFuelTech] + ': ' + xDateData[hoverFuelTech] + ' MW')

        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + (height+10);
            d += " " + mouse[0] + "," + 18;
            return d;
          });
      })
  });
}

function setup() {
  setupLegend();
  getData();
}

setup();
