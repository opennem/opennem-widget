import { select, mouse as d3Mouse } from "d3-selection";
import { timeFormat as d3TimeFormat } from "d3-time-format";
import { format } from "d3-format";
import { extent, bisector } from "d3-array";
import { axisLeft, axisBottom } from "d3-axis";

import { fuelTechIds, fuelTechIdColours, getLabelById } from "./fuel-techs";

export function setup(viz, data) {
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
export function drawXAxisGrid(viz) {
  viz.g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + viz.height + ")")
    .style("pointer-events", "none")
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
    .remove();
}

export function drawXAxisText(viz) {
  viz.g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + viz.height + ")")
    .style("pointer-events", "none")
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
    .attr("y", 5)
    .attr("x", 1)
    .style("text-anchor", "start")
    .selectAll("line")
    .remove();
}

export function drawYAxis(viz) {
  const yAxis = viz.g
    .append("g")
    .attr("class", "axis axis--y")
    .style("pointer-events", "none")
    .call(axisLeft(viz.y).ticks(4, "~s").tickSize(-viz.width));
  yAxis
    .selectAll("text")
    .attr("y", -7)
    .attr("x", 1)
    .style("pointer-events", "none")
    .style("text-anchor", "start");
}

export function drawStackedAreaHover(viz, data) {
  const topRectWidth = 150;
  const topLeftEdge = topRectWidth / 2;
  const topRightEdge = viz.width - topLeftEdge;
  const topRectHoverFn = function (mouseLoc) {
    if (mouseLoc <= topLeftEdge) return 0;
    if (mouseLoc >= topRightEdge) return viz.width - topRectWidth;
    return mouseLoc - topLeftEdge;
  };

  const bottomRectWidth = 100;
  const bottomLeftEdge = bottomRectWidth / 2;
  const bottomRightEdge = viz.width - bottomLeftEdge;
  const bottomRectHoverFn = function (mouseLoc) {
    if (mouseLoc <= bottomLeftEdge) return 0;
    if (mouseLoc >= bottomRightEdge) return viz.width - bottomRectWidth;
    return mouseLoc - bottomLeftEdge;
  };

  // draw area
  const stackedArea = viz.g
    .append("g")
    .attr("class", "stacked-area")
    .selectAll("path")
    .data(viz.stack(data))
    .enter()
    .append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      return fuelTechIdColours[d.key];
    })
    .attr("d", viz.area);

  const hover = viz.g
    .append("g")
    .attr("class", "hover-group")
    .style("opacity", "0")
    .style("pointer-events", "none");

  hover
    .append("line")
    .attr("class", "hover-line")
    .style("stroke", "#c74523")
    .style("pointer-events", "none");
  hover
    .append("rect")
    .attr("class", "hover-top-rect")
    .attr("width", topRectWidth)
    .attr("height", 20)
    .attr("rx", 3);
  hover
    .append("rect")
    .attr("class", "hover-bottom-rect")
    .attr("width", bottomRectWidth)
    .attr("height", 15)
    .attr("rx", 3);
  hover
    .append("text")
    .attr("class", "hover-text hover-date")
    .attr("y", viz.height + 11);
  hover.append("text").attr("class", "hover-text hover-value").attr("y", 14);

  stackedArea.on("mouseover", function () {
    select(".hover-group").style("opacity", "1");
  });
  stackedArea.on("mouseout", function () {
    select(".hover-group").style("opacity", "0");
  });
  stackedArea.on("touchmove mousemove", function (hoverPath) {
    const mouse = d3Mouse(this);
    const dateFormat = d3TimeFormat("%_d %b, %I:%M %p");
    const valueFormat = format(",.0f");
    const xDate = viz.x.invert(mouse[0]);
    const ftId = hoverPath.key;
    const bisectDate = bisector(function (d) {
      return d.key;
    }).left;

    const i = bisectDate(data, xDate.getTime(), 1);
    const dataTime = new Date(parseInt(data[i].key));
    const dataPoint = data[i].value;

    select(".hover-line")
      .attr("y1", 20)
      .attr("y2", viz.height)
      .attr("x1", mouse[0])
      .attr("x2", mouse[0]);
    select(".hover-top-rect").attr("x", function () {
      return topRectHoverFn(mouse[0]);
    });
    select(".hover-value")
      .attr("x", function () {
        return topRectHoverFn(mouse[0]) + topLeftEdge;
      })
      .text(getLabelById(ftId) + ": " + valueFormat(dataPoint[ftId]) + " MW");
    select(".hover-bottom-rect")
      .attr("x", function () {
        return bottomRectHoverFn(mouse[0]);
      })
      .attr("y", viz.height);
    select(".hover-date")
      .attr("x", function () {
        return bottomRectHoverFn(mouse[0]) + bottomLeftEdge;
      })
      .text(dateFormat(dataTime));
  });
}
