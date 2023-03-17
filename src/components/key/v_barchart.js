import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { mode } from "d3";

const V_BarChart = (props) => {
  const d3Chart = useRef();

  useEffect(() => {
    const totalWidth = 250;
    const totalHeight = 250;

    const margin = { top: 10, right: 10, bottom: 20, left: 25 };
    const charwidth = totalWidth - margin.left - margin.right;
    const charheight = totalHeight - margin.top - margin.bottom;

    const models = props.sample.map((d) => d.model);
    console.log(models);

    const x = d3
      .scaleBand()
      .domain(models)
      .range([0, charheight])
      .padding(0.05);

    const maxScore = d3.max(props.sample, (d) => d.score);

    const format = d3.format("~s");
    console.log(format(100));

    const y = d3
      .scaleLinear()
      .domain([0, maxScore])
      .range([charheight, margin.top]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).tickFormat(format);

    const svg = d3
      .select(d3Chart.current)
      .attr("width", totalWidth)
      .attr("height", totalHeight);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // bind our data to rectangles
    g.selectAll("rect")
      .data(props.sample)
      .join("rect")
      // set attributes for each bar
      .attr("x", (d) => x(d.model))
      .attr("y", (d) => y(d.score)) // each bar starts at the same x position
      // pass the name to the y-scale to get y position
      .attr("width", x.bandwidth()) // pass the score to the x-scale to get width of the bar
      .attr("height", (d) => y(0) - y(d.score)) // get the width of each band in the scale
      .attr("fill", "steelblue");

    // add a group for the y-axis
    g.append("g")
      .call(yAxis)
      // remove the baseline
      .call((g) => g.select(".domain").remove());

    // add a group for the x-axis
    g.append("g")
      // we have to move this group down to the bottom of the vis
      .attr("transform", `translate(0, ${charheight})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove())
      // add a label for the x-axis
      .append("text")
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("x", charwidth / 2)
      .attr("y", 40)
      .text("Score");
  });

  return (
    <div id="d3demo">
      <svg ref={d3Chart}></svg>
    </div>
  );
};

export default V_BarChart;
