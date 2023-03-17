import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { mode } from "d3";

const Scatter = () => {
  const d3Chart = useRef();

  useEffect(() => {
    const iris = [
      {
        sepalLength: 4.6,
        sepalWidth: 3.1,
        petalLength: 1.5,
        petalWidth: 0.2,
        species: "setosa",
      },
      {
        sepalLength: 5,
        sepalWidth: 3.6,
        petalLength: 1.4,
        petalWidth: 0.2,
        species: "setosa",
      },
      {
        sepalLength: 5.4,
        sepalWidth: 3.9,
        petalLength: 1.7,
        petalWidth: 0.4,
        species: "setosa",
      },
    ];

    const widthIris = 300;
    const heightIris = 300;

    const sepalLengthExtent = d3.extent(iris, (d) => d.sepalLength);

    const xIris = d3
      .scaleLinear()
      .domain(sepalLengthExtent)
      .nice()
      .range([0, widthIris]);

    const sepalWidthExtent = d3.extent(iris, (d) => d.sepalWidth);
    const yIris = d3
      .scaleLinear()
      .domain(sepalWidthExtent)
      .nice()
      .range([heightIris, 0]);

    const species = new Set(iris.map((d) => d.species));
    const colorIris = d3
      .scaleOrdinal()
      .domain(species)
      .range(d3.schemeCategory10);

    const margin = { top: 50, right: 120, bottom: 50, left: 120 };

    const svg = d3
      .select(d3Chart.current)
      .attr("width", widthIris + margin.left + margin.right)
      .attr("height", heightIris + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // draw the circles in circlesGroup

    const circlesGroup = g.append("g");

    circlesGroup
      .selectAll("circle")
      .data(iris)
      .join("circle")
      .attr("cx", (d) => xIris(d.sepalLength))
      .attr("cy", (d) => yIris(d.sepalWidth))
      .attr("fill", (d) => colorIris(d.species))
      .attr("r", 3);

    // create and add axes
    const yAxisIris = (g) =>
      g
        .call(d3.axisLeft(yIris))
        // remove baseline from axis
        .call((g) => g.select(".domain").remove())
        // add title
        .append("text")
        .attr("x", -40)
        .attr("y", heightIris / 2)
        .attr("fill", "black")
        .attr("dominant-baseline", "middle")
        .text("sepal width (cm)");

    const xAxisIris = (g) =>
      g
        .attr("transform", `translate(0, ${heightIris})`)
        .call(d3.axisBottom(xIris))
        // remove baseline from axis
        .call((g) => g.select(".domain").remove())
        // add title
        .append("text")
        .attr("x", widthIris / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("sepal length (cm)");

    g.append("g").call(xAxisIris);
    g.append("g").call(yAxisIris);
  });

  return (
    <div id="d3demo">
      <svg ref={d3Chart}></svg>
    </div>
  );
};

export default Scatter;
