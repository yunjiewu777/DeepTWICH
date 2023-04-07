import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { red } from "@mui/material/colors";

function Mainplot(props) {
  const [plotData, setPlotData] = useState([]);

  const [lineCoords, setLineCoords] = useState([]);

  const setNewKeyword = (word) => {
    props.setNewKeyword(word);
  };

  const d3Chart = useRef();

  useEffect(() => {
    d3.select(d3Chart.current).selectAll("*").remove();

    // if (plotData.length === 0) {
    //   setPlotData(props.keywords);
    // }

    setPlotData(props.keywords);

    const margin = { top: 10, right: 10, bottom: 50, left: 50 };
    const visWidth = 450;
    const visHeight = 500;

    // create scales

    const x = d3
      .scaleLinear()
      .domain(d3.extent(plotData, (d) => d["embed_two"][0]))
      .nice()
      .range([0, visWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(plotData, (d) => d["embed_two"][1]))
      .nice()
      .range([visHeight, 0]);

    const classes = Array.from(new Set(plotData.map((d) => d.class)));

    const Color = d3.scaleOrdinal().domain(classes).range(d3.schemeCategory10);

    // set up
    const svg = d3
      //   .create("svg")
      .select(d3Chart.current)
      .attr("width", visWidth + margin.left + margin.right)
      .attr("height", visHeight + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // axes
    const xAxisGroup = g
      .append("g")
      .attr("transform", `translate(0,${visHeight})`)
      .call(d3.axisBottom(x))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", visWidth / 2)
          .attr("y", 40)
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .text("x")
      );

    const yAxisGroup = g
      .append("g")
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -40)
          .attr("y", visHeight / 2)
          .attr("fill", "black")
          .attr("dominant-baseline", "middle")
          .text("y")
      );

    // grid based on https://observablehq.com/@d3/scatterplot
    const yGrid = g.append("g");

    yGrid
      .selectAll("line")
      .data(y.ticks())
      .join("line")
      .attr("stroke", "#d3d3d3")
      .attr("x1", 0)
      .attr("x2", visWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d));

    const xGrid = g.append("g");

    xGrid
      .selectAll("line")
      .data(x.ticks())
      .join("line")
      .attr("stroke", "#d3d3d3")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", (d) => 0)
      .attr("y2", (d) => visHeight);

    // clip path hides dots that go outside of the vis when zooming/panning
    svg
      .append("clipPath")
      .attr("id", "border")
      .append("rect")
      .attr("width", visWidth)
      .attr("height", visHeight)
      .attr("fill", "white");

    const dotsGroup = g.append("g").attr("clip-path", "url(#border)");

    // draw circles
    const dots = dotsGroup
      .selectAll("circle")
      .data(plotData)
      .join("circle")
      .attr("cx", (d) => x(d["embed_two"][0]))
      .attr("cy", (d) => y(d["embed_two"][1]))
      .attr("fill", (d) => Color(d["cluster"]))
      .attr("opacity", 1)
      .attr("r", 3)
      // ********** new stuff starts here **********
      .on("mouseenter", mouseEnter)
      .on("mouseleave", mouseLeave)
      .on("click", mouseClick);

    // // draw circles
    // const lines = linesGroup
    //   .selectAll("circle")
    //   .data(plotData)
    //   .join("circle")
    //   .attr("cx", (d) => x(d["embed_two"][0]))
    //   .attr("cy", (d) => y(d["embed_two"][1]))
    //   .attr("fill", (d) => Color(d["cluster"]))
    //   .attr("opacity", 1)
    //   .attr("r", 3)
    //   // ********** new stuff starts here **********
    //   .on("mouseenter", mouseEnter)
    //   .on("mouseleave", mouseLeave)
    //   .on("click", mouseClick);

    const zoom = d3
      .zoom()
      .extent([
        [margin.left, margin.top],
        [visWidth + margin.left, visHeight + margin.top],
      ])
      // determine how much you can zoom out and in
      .scaleExtent([1, Infinity])
      .on("zoom", onZoom);

    svg.call(zoom);

    function onZoom(event) {
      // get updated scales
      const xNew = event.transform.rescaleX(x);
      const yNew = event.transform.rescaleY(y);

      // update the position of the dots
      dots
        .attr("cx", (d) => xNew(d["embed_two"][0]))
        .attr("cy", (d) => yNew(d["embed_two"][1]));

      // tooltip
      //   .attr("cx", (d) => xNew(d["embed_two"][0]))
      //   .attr("cy", (d) => yNew(d["embed_two"][1]));

      // update the axes
      xAxisGroup
        .call(d3.axisBottom(xNew))
        .call((g) => g.selectAll(".domain").remove());

      yAxisGroup
        .call(d3.axisLeft(yNew))
        .call((g) => g.selectAll(".domain").remove());

      // update the grid
      yGrid
        .selectAll("line")
        .data(yNew.ticks())
        .join("line")
        .attr("stroke", "#d3d3d3")
        .attr("x1", 0)
        .attr("x2", visWidth)
        .attr("y1", (d) => 0.5 + yNew(d))
        .attr("y2", (d) => 0.5 + yNew(d));

      xGrid
        .selectAll("line")
        .data(xNew.ticks())
        .join("line")
        .attr("stroke", "#d3d3d3")
        .attr("y1", 0)
        .attr("y2", visHeight)
        .attr("x1", (d) => 0.5 + xNew(d))
        .attr("x2", (d) => 0.5 + xNew(d));

      // const pData = [...plotData];

      // pData.map((d) => {
      //   d["embed_two"][0] = xNew(d["embed_two"][0]);
      //   d["embed_two"][1] = yNew(d["embed_two"][1]);
      // });

      // setPlotData(pData);
    }

    // const linesGroup = g.append("g");

    // lineGroup
    //   .append("line")
    //   .attr("x1", lineCoords[0][0])
    //   .attr("y1", lineCoords[0][1])
    //   .attr("x2", lineCoords[1][0])
    //   .attr("y2", lineCoords[1][1])
    //   .attr("stroke", "red")
    //   .attr("stroke-width", 2)
    //   .attr("opacity", lineCoords.length > 1 ? 1 : 0);

    const radius = 3;

    // create tooltip
    const tooltip = g.append("g").attr("visibility", "hidden");
    const tooltipHeight = 16;

    // add a rectangle to the tooltip to serve as a background
    const tooltipRect = tooltip
      .append("rect")
      .attr("fill", "black")
      .attr("rx", 5)
      .attr("height", tooltipHeight);

    // add a text element to the tooltip to contain the label
    const tooltipText = tooltip
      .append("text")
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("y", 2) // offset it from the edge of the rectangle
      .attr("x", 3) // offset it from the edge of the rectangle
      .attr("dominant-baseline", "hanging");

    function mouseClick(event, d) {
      // d3.select(this).attr("r", 10).attr("fill", "red");
      console.log(d);

      setNewKeyword(d["word"]);

      if (props.selectedPoints.length < 3) {
        // const a = props.selectedPoints.append(d);
        props.setSelectedPoints([...props.selectedPoints, d]);
      }

      if (props.selectedPoints.length === 3) {
        drawLines();
      }

      // console.log(props.selectedPoints);
    }

    // handle hovering over a circle
    function mouseEnter(event, d) {
      // make the circle larger
      d3.select(this).attr("r", radius * 2);

      // update the label's text and get its width
      tooltipText.text(d["word"] + ":" + d["cluster"]);
      const labelWidth = tooltipText.node().getComputedTextLength();

      // set the width of the tooltip's background rectangle
      // to match the width of the label, plus some extra space
      tooltipRect.attr("width", labelWidth + 6);

      // move the tooltip to the position of the circle (offset by a bit)
      // and make the tooltip visible

      // const xPos = x(d["embed_two"][0]) + radius * 3;
      // const yPos = y(d["embed_two"][1]) - tooltipHeight / 2;

      const xPos = d3.select(this).attr("cx");
      const yPos = d3.select(this).attr("cy") - tooltipHeight * 2;

      tooltip
        .attr("transform", `translate(${xPos},${yPos})`)
        .attr("visibility", "visible");
    }

    // handle leaving a circle
    function mouseLeave(event, d) {
      // reset the size of the circle
      d3.select(this).attr("r", radius);

      // make the tooltip invisible
      tooltip.attr("visibility", "hidden");
    }

    const linesPGroup = g.append("g");
    const linesNGroup = g.append("g");

    drawLines();

    function drawLines() {
      const selectedPoints = props.selectedPoints;

      if (selectedPoints.length === 2) {
        const positiveData = [
          { source: selectedPoints[0], target: selectedPoints[1] },
        ];

        const lineP = linesPGroup
          .selectAll("line")
          .data(positiveData)
          .join("line")
          .attr("x1", (d) => x(d.source["embed_two"][0]))
          .attr("y1", (d) => y(d.source["embed_two"][1]))
          .attr("x2", (d) => x(d.target["embed_two"][0]))
          .attr("y2", (d) => y(d.target["embed_two"][1]))
          .attr("stroke", "green")
          .attr("stroke-width", 2);
      } else if (selectedPoints.length === 3) {
        const positiveData = [
          { source: selectedPoints[0], target: selectedPoints[1] },
        ];

        const lineP = linesPGroup
          .selectAll("line")
          .data(positiveData)
          .join("line")
          .attr("x1", (d) => x(d.source["embed_two"][0]))
          .attr("y1", (d) => y(d.source["embed_two"][1]))
          .attr("x2", (d) => x(d.target["embed_two"][0]))
          .attr("y2", (d) => y(d.target["embed_two"][1]))
          .attr("stroke", "green")
          .attr("stroke-width", 2);

        const negativeData = [
          { source: selectedPoints[0], target: selectedPoints[2] },
        ];

        const lineN = linesNGroup
          .selectAll("line")
          .data(negativeData)
          .join("line")
          .attr("x1", (d) => x(d.source["embed_two"][0]))
          .attr("y1", (d) => y(d.source["embed_two"][1]))
          .attr("x2", (d) => x(d.target["embed_two"][0]))
          .attr("y2", (d) => y(d.target["embed_two"][1]))
          .attr("stroke", "red")
          .attr("stroke-width", 2);
      } else {
        linesPGroup.selectAll("line").remove();
        linesNGroup.selectAll("line").remove();
        console.log("remove");
      }
    }
  });

  return (
    <div id="d3demo">
      <svg ref={d3Chart}></svg>
    </div>
  );
}

export default Mainplot;
