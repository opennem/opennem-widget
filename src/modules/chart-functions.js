import { select, selectAll, mouse as d3Mouse } from "d3-selection";
import { timeFormat as d3TimeFormat } from "d3-time-format";
import { format } from "d3-format";
import { extent, bisector } from "d3-array";
import { axisLeft, axisBottom } from "d3-axis";

const dateFormat = d3TimeFormat("%_d %b, %I:%M %p");
const valueFormat = (value) =>
  value >= 0.999 ? format(",.0f")(value) : format(",.2f")(value);
const percentFormat = format(",.2f");

function calculateTotalConsumptionAndRenewables(data, fuelTechs) {
  data.forEach(function (d) {
    let totalConsumption = 0;
    let totalRenewable = 0;
    fuelTechs.fuelTechIds.forEach(function (ft) {
      totalConsumption += d.value ? d.value[ft] : d[ft];
      if (fuelTechs.isRenewable(ft)) {
        totalRenewable += d.value ? d.value[ft] : d[ft];
      }
    });
    d._totalConsumption = totalConsumption;
    d._totalRenewable = totalRenewable;
  });
}

function sumTotals(data, property) {
  let total = 0;
  data.forEach(function (d) {
    total += d[property];
  });
  return total;
}

export function setup(viz, data, fuelTechs, maxY) {
  calculateTotalConsumptionAndRenewables(data, fuelTechs);

  viz.x.domain(
    extent(data, function (d) {
      return d.key;
    })
  );
  viz.y.domain([0, maxY]);
  viz.stack.keys(fuelTechs.fuelTechIds).value(function value(d, key) {
    return d.value ? d.value[key] : d[key];
  });
}

export function drawTitle(viz, data, unit) {
  const allConsumption = sumTotals(data, "_totalConsumption");
  const allRenewable = sumTotals(data, "_totalRenewable");
  const averageConsumption = valueFormat(allConsumption / data.length);
  const renewablePercentage = percentFormat(
    (allRenewable / allConsumption) * 100
  );

  viz.g
    .append("text")
    .attr("class", "title")
    .attr("x", 7)
    .attr("y", 14)
    .style("fill", "#333")
    .append("tspan")
    .text(unit)
    .style("font-size", 8)
    .style("font-weight", "bold");

  viz.g
    .append("text")
    .attr("class", "stats")
    .attr("x", viz.width - 6)
    .attr("y", 14)
    .style("font-size", 10)
    .style("text-anchor", "end")
    .append("tspan")
    .attr("class", "stat-title")
    .text("Av.: ")
    .append("tspan")
    .attr("class", "stat-value")
    .text(averageConsumption + " " + unit + "      ")
    .append("tspan")
    .attr("class", "stat-title")
    .text("Renewables: ")
    .append("tspan")
    .attr("class", "stat-value")
    .text(renewablePercentage + "%");
}

export function resize(viz, data, fuelTechs) {
  const offsetWidth = document.getElementById(viz.chartId).offsetWidth;
  const updatedWidth = offsetWidth < 280 ? 280 : offsetWidth;

  viz.width = updatedWidth - viz.margin.left - viz.margin.right;
  viz.svg.attr("width", viz.width + viz.margin.left + viz.margin.right);
  viz.x.rangeRound([0, viz.width]);

  const chartId = "#" + viz.chartId;

  selectAll(chartId + " .axis--x").remove();
  selectAll(chartId + " .axis--y").remove();
  select(chartId + " .stacked-area").remove();
  select(chartId + " .hover-group").remove();
  select(chartId + " .title").remove();
  select(chartId + " .stats").remove();
  drawTitle(viz, data);
  drawXAxisText(viz);
  drawStackedAreaHover(viz, data, fuelTechs);
  drawXAxisGrid(viz);
  drawYAxis(viz);
}

export function drawXAxisGrid(viz) {
  const xAxis = viz.g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + viz.height + ")")
    .style("pointer-events", "none")
    .call(
      axisBottom(viz.x)
        .ticks(3)
        .tickSize(-viz.height + 20)
    );

  xAxis.selectAll("text").remove();
  xAxis.selectAll("line").attr("y1", 0);
}

export function drawXAxisText(viz) {
  const xAxis = viz.g
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
    );

  xAxis
    .selectAll("text")
    .attr("y", 5)
    .attr("x", 1)
    .style("text-anchor", "start");
  xAxis.selectAll("line").remove();
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
    .attr("x", 7)
    .style("pointer-events", "none")
    .style("text-anchor", "start");
}

export function drawStackedAreaHover(viz, data, fuelTechs, unit) {
  const topRectWidth = 250;
  const topLeftEdge = topRectWidth / 2;
  const topRightEdge = viz.width - topLeftEdge;
  const topRectHoverFn = function (mouseLoc) {
    if (mouseLoc <= topLeftEdge) return 1;
    if (mouseLoc >= topRightEdge) return viz.width - topRectWidth - 1;
    return mouseLoc - topLeftEdge;
  };

  const bottomRectWidth = 100;
  const bottomLeftEdge = bottomRectWidth / 2;
  const bottomRightEdge = viz.width - bottomLeftEdge;
  const bottomRectHoverFn = function (mouseLoc) {
    if (mouseLoc <= bottomLeftEdge) return 1;
    if (mouseLoc >= bottomRightEdge) return viz.width - bottomRectWidth - 1;
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
      return fuelTechs.fuelTechIdColours[d.key];
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
    .attr("height", 18)
    .attr("y", 1)
    .attr("rx", 6);
  hover
    .append("rect")
    .attr("class", "hover-bottom-rect")
    .attr("width", bottomRectWidth)
    .attr("height", 15)
    .attr("rx", 6);
  hover
    .append("text")
    .attr("class", "hover-text hover-date")
    .attr("y", viz.height + 11);
  hover.append("text").attr("class", "hover-text hover-value").attr("y", 14);
  hover.append("text").attr("class", "hover-text hover-total").attr("y", 14);
  hover
    .append("rect")
    .attr("class", "hover-ft-rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("rx", 1)
    .attr("y", 4);

  stackedArea.on("mouseover", function () {
    select(".hover-group").style("opacity", "1");
  });
  stackedArea.on("mouseout", function () {
    select(".hover-group").style("opacity", "0");
  });
  stackedArea.on("touchmove mousemove", function (hoverPath) {
    const mouse = d3Mouse(this);
    const xDate = viz.x.invert(mouse[0]);
    const ftId = hoverPath.key;
    const bisectDate = bisector(function (d) {
      return d.key;
    }).left;

    const i = bisectDate(data, xDate.getTime(), 1);
    const dataTime = new Date(parseInt(data[i].key));
    const dataPoint = data[i].value;
    const dataPointTotal = data[i]._totalConsumption;

    select(".hover-line")
      .attr("y1", 20)
      .attr("y2", viz.height)
      .attr("x1", mouse[0])
      .attr("x2", mouse[0]);

    select(".hover-top-rect").attr("x", function () {
      return topRectHoverFn(mouse[0]);
    });

    select(".hover-ft-rect")
      .attr("x", function () {
        return topRectHoverFn(mouse[0]) + 7;
      })
      .style("fill", fuelTechs.getColourById(ftId));

    select(".hover-value")
      .attr("x", function () {
        return topRectHoverFn(mouse[0]) + 22;
      })
      .text(fuelTechs.getLabelById(ftId) + ": " + valueFormat(dataPoint[ftId]) + " " + unit);

    select(".hover-total")
      .attr("x", function () {
        return topRectHoverFn(mouse[0]) + topRectWidth - 7;
      })
      .text("Total: " + valueFormat(dataPointTotal) + " " + unit);

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
