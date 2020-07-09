import { select } from "d3-selection";
import { scaleTime, scaleLinear } from "d3-scale";
import { area as d3Area, stack as d3Stack, curveMonotoneX } from "d3-shape";

export default function (chartId) {
  // const formatTime = d3.timeFormat("%e %b, %H:%M");
  const windowWidth = window.innerWidth > 600 ? 590 : window.innerWidth - 10;
  const margin = { top: 1, right: 0, bottom: 15, left: 0 };
  const width = windowWidth - margin.left - margin.right;
  const height = 220 - margin.top - margin.bottom;
  const svg = select("#" + chartId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  const x = scaleTime().rangeRound([0, width]);
  const y = scaleLinear().rangeRound([height, 0]);
  const stack = d3Stack();
  const area = d3Area()
    .curve(curveMonotoneX)
    .x(function (d) {
      return x(d.data.key);
    })
    .y0(function (d) {
      return y(d[0]);
    })
    .y1(function (d) {
      return y(d[1]);
    });
  return {
    width: width,
    height: height,
    svg: svg,
    g: g,
    x: x,
    y: y,
    stack: stack,
    area: area,
  };
}
