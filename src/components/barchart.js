import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { mode } from "d3";

const sample = [
  { model: "PKE", score: 100 },
  { model: "RAKE", score: 151 },
  { model: "BERT", score: 300 },
  { model: "RUBY", score: 121 },
];

const RSChart = () => {
  const d3Chart = useRef();

  useEffect(() => {
    const totalWidth = 200;
    const totalHeight = 500;

    const margin = { top: 10, right: 10, bottom: 60, left: 40 };
    const charwidth = totalWidth - margin.left - margin.right;
    const charheight = totalHeight - margin.top - margin.bottom;

    const models = sample.map((d) => d.model);
    console.log(models);

    const y = d3
      .scaleBand()
      .domain(models)
      .range([0, charheight])
      .padding(0.05);

    // const x = d3
    //   .scaleBand()
    //   .domain(d3.range(sample.length))
    //   .range([margin.left, charwidth - margin.right])
    //   .padding(0.1);

    const maxScore = d3.max(sample, (d) => d.score);

    const format = d3.format("~s");
    console.log(format(100));

    const x = d3.scaleLinear().domain([0, maxScore]).range([0, charwidth]);

    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x).tickFormat(format);

    // const max = d3.max(sample, function (d) {
    //     return d.score;
    //   });

    //   const y = d3.scaleLinear().domain([0, max]).range([charheight, margin.top]);

    const svg = d3
      .select(d3Chart.current)
      .attr("width", totalWidth)
      .attr("height", totalHeight);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // bind our data to rectangles
    g.selectAll("rect")
      .data(sample)
      .join("rect")
      // set attributes for each bar
      .attr("x", 0) // each bar starts at the same x position
      .attr("y", (d) => y(d.model)) // pass the name to the y-scale to get y position
      .attr("width", (d) => x(d.score)) // pass the score to the x-scale to get width of the bar
      .attr("height", y.bandwidth()) // get the width of each band in the scale
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

    // svg
    //   .append("g")
    //   .attr("transform", "translate(0, " + charheight + ")")
    //   .call(
    //     d3
    //       .axisBottom(x)
    //       .tickFormat((i) => sample[i].model)
    //       .tickSizeOuter(0)
    //   );

    // svg
    //   .append("g")
    //   .attr("tranform", "translate(" + margin.left + ",0)")
    //   .call(d3.axisLeft(y));

    // svg
    //   .append("g")
    //   .attr("fill", "#65f0eb")
    //   .selectAll("rect")
    //   .data(sample)
    //   .join("rect")
    //   .attr("x", (d, i) => x(i))
    //   .attr("y", (d) => y(d.score))
    //   .attr("height", (d) => y(0) - y(d.score))
    //   .attr("width", x.bandwidth());

    // const totalWidth = 100;
    // const totalHeight = 400;

    // const margin = { top: 20, bottom: 45, left: 75, right: 10 };

    // const visWidth = totalWidth - margin.left - margin.right;
    // const visHeight = totalHeight - margin.top - margin.bottom;
    // const models = data.map((d) => d.model);

    // const y = d3.scaleBand().domain(models).range([0, visHeight]).padding(0.2);

    // const maxScore = d3.max(data, (d) => d.score);

    // const x = d3.scaleLinear().domain([0, maxScore]).range([0, visWidth]);

    // const yAxis = d3.axisLeft(y);
    // const xAxis = d3.axisBottom(x);

    // // create and select an svg element that is the size of the bars plus margins
    // const svg = d3
    //   .create("svg")
    //   .attr("width", totalWidth)
    //   // we could also put visHeight + margin.top + margin.bottom instead of totalHeight
    //   .attr("height", totalHeight);

    // // append a group element and move it left and down to create space
    // // for the left and top margins
    // const g = svg
    //   .append("g")
    //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // // bind our data to rectangles
    // g.selectAll("rect")
    //   .data(data)
    //   .join("rect")
    //   // set attributes for each bar
    //   .attr("x", 0) // each bar starts at the same x position
    //   .attr("y", (d) => y(d.model)) // pass the name to the y-scale to get y position
    //   .attr("width", (d) => x(d.score)) // pass the score to the x-scale to get width of the bar
    //   .attr("height", y.bandwidth()) // get the width of each band in the scale
    //   .attr("fill", "steelblue");

    // // add a group for the y-axis
    // g.append("g")
    //   .call(yAxis)
    //   // remove the baseline
    //   .call((g) => g.select(".domain").remove());

    // // add a group for the x-axis
    // g.append("g")
    //   // we have to move this group down to the bottom of the vis
    //   .attr("transform", `translate(0, ${visHeight})`)
    //   .call(xAxis)
    //   .call((g) => g.select(".domain").remove())
    //   // add a label for the x-axis
    //   .append("text")
    //   .attr("fill", "black")
    //   .attr("font-family", "sans-serif")
    //   .attr("x", visWidth / 2)
    //   .attr("y", 40)
    //   .text("Score");

    // return svg.node();
  });

  return (
    <div id="d3demo">
      <svg ref={d3Chart}></svg>
    </div>
  );
};

export default RSChart;
