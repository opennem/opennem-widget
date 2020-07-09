import { select, mouse as d3Mouse } from "d3-selection";
import { timeFormat as d3TimeFormat } from "d3-time-format";
import { extent } from "d3-array";
import { axisLeft, axisBottom } from "d3-axis";

import { fuelTechIds, fuelTechIdColours } from "./fuel-techs";

export function setup(viz, data) {
  // setup x, y, stack
  viz.x.domain(
    extent(data, function (d) {
      return d.key;
    })
  );
  viz.y.domain([0, 33000]);
  viz.stack.keys(fuelTechIds).value(function value(d, key) {
    return d.value[key];
  });
}

export function drawTitle(viz) {
  // draw title
  viz.g
    .append("text")
    .attr("class", "title")
    .text("Generation")
    .attr("x", 2)
    .attr("y", 14)
    .style("font-size", 10)
    .style("fill", "#333")
    .append("tspan")
    .text(" MW")
    .style("font-size", 8)
    .style("font-weight", "bold");
}

export function drawXAxis(viz) {
  // draw x-axis
  viz.g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + viz.height + ")")
    .call(
      axisBottom(viz.x)
        .ticks(3)
        .tickSize(-viz.height)
        .tickFormat(function (d) {
          var currentHour = d.getHours();
          var currentMinute = d.getMinutes();
          var dayFormat = d3TimeFormat("%_d %b");
          var timeFormat = d3TimeFormat("%H:%M");
          var formatted = timeFormat(d);

          if (currentHour === 0 && currentMinute === 0) {
            formatted = dayFormat(d);
          }
          return formatted;
        })
    )
    .selectAll("text")
    .attr("y", 6)
    .attr("x", 1)
    .style("text-anchor", "start");
}

export function drawYAxis(viz) {
  // draw y-axis
  const yAxis = viz.g
    .append("g")
    .attr("class", "axis axis--y")
    .call(axisLeft(viz.y).ticks(4).tickSize(-viz.width));
  yAxis
    .selectAll("text")
    .attr("y", -7)
    .attr("x", 1)
    .style("text-anchor", "start");
}

export function drawStackedArea(viz, data) {
  // draw stacked area
  const stackedArea = viz.g
    .append("g")
    .attr("class", "stacked-area")
    .style("opacity", 0.9);
  stackedArea
    .selectAll("path")
    .data(viz.stack(data))
    .enter()
    .append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      return fuelTechIdColours[d.key];
    })
    .attr("d", viz.area);

  stackedArea.exit().remove();
}

export function drawHover(viz) {
  // hover layer
  const hover = viz.g.append("g").attr("class", "hover-group");
  hover.append("line").attr("class", "hover-line").style("stroke", "#000");
  hover
    .append("rect")
    .attr("width", viz.width)
    .attr("height", viz.height)
    .style("fill", "transparent");
  hover.on("touchmove mousemove", function () {
    var mouse = d3Mouse(this);
    select(".hover-line")
      .attr("y1", 0)
      .attr("y2", viz.height)
      .attr("x1", mouse[0])
      .attr("x2", mouse[0]);
  });
  hover.on("mouseenter", function () {
    select(".hover-group").style("opacity", "1");
  });
  hover.on("mouseout", function () {
    select(".hover-group").style("opacity", "0");
  });
}
