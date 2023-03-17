import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { red } from "@mui/material/colors";
import { ScatterChart, Scatter, ReferenceArea, XAxis, YAxis } from "recharts";
import CustomDot from "./CustomDot";
import getClickedPoint from "./getClickedPoint";

const MIN_ZOOM = 5; // adjust based on your data
const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };

function Mainplot(props) {
  const data = props.keywords;

  const setNewKeyword = (word) => {
    props.setNewKeyword(word);
  };

  // data currently on the plot
  const [filteredData, setFilteredData] = useState(data);
  // selected data point
  const [selectedPoint, setSelectedPoint] = useState(data[1]);
  // zoom coordinates
  const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
  // flag if currently zooming (press and drag)
  const [isZooming, setIsZooming] = useState(false);
  // flag if zoomed in
  const isZoomed = filteredData?.length !== data?.length;

  // flag to show the zooming area (ReferenceArea)
  const showZoomBox =
    isZooming &&
    !(Math.abs(zoomArea.x1 - zoomArea.x2) < MIN_ZOOM) &&
    !(Math.abs(zoomArea.y1 - zoomArea.y2) < MIN_ZOOM);

  // reset the states on zoom out
  function handleZoomOut() {
    setFilteredData(data);
    setZoomArea(DEFAULT_ZOOM);
  }

  /**
   * Two possible events:
   * 1. Clicking on a dot(data point) to select
   * 2. Clicking on the plot to start zooming
   */
  function handleMouseDown(e) {
    setIsZooming(true);
    const { chartX, chartY, xValue, yValue } = e || {};
    const clickedPoint = getClickedPoint(chartX, chartY, filteredData);

    if (clickedPoint) {
      setSelectedPoint(clickedPoint);
    } else {
      // console.log("zoom start");
      setZoomArea({ x1: xValue, y1: yValue, x2: xValue, y2: yValue });
    }
  }

  // Update zoom end coordinates
  function handleMouseMove(e) {
    if (isZooming) {
      // console.log("zoom selecting");
      setZoomArea((prev) => ({ ...prev, x2: e?.xValue, y2: e?.yValue }));
    }
  }

  // When zooming stops, update with filtered data points
  // Ignore if not enough zoom
  function handleMouseUp(e) {
    if (isZooming) {
      setIsZooming(false);
      let { x1, y1, x2, y2 } = zoomArea;

      // ensure x1 <= x2 and y1 <= y2
      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];

      if (x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM) {
        // console.log("zoom cancel");
      } else {
        // console.log("zoom stop");
        const dataPointsInRange = filteredData.filter(
          (d) =>
            d["embed_two"][0] >= x1 &&
            d["embed_two"][0] <= x2 &&
            d["embed_two"][1] >= y1 &&
            d["embed_two"][1] <= y2
        );
        setFilteredData(dataPointsInRange);
        setZoomArea(DEFAULT_ZOOM);
      }
    }

    return (
      <div className="plot-container">
        {isZoomed && <button onClick={handleZoomOut}>Zoom Out</button>}
        <ScatterChart
          width={400}
          height={400}
          margin={{ top: 50 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <XAxis
            type="number"
            dataKey="x"
            domain={["dataMin - 20", "dataMax + 20"]}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={["dataMin - 50", "dataMax + 50"]}
          />
          {showZoomBox && (
            <ReferenceArea
              x1={zoomArea?.x1}
              x2={zoomArea?.x2}
              y1={zoomArea?.y1}
              y2={zoomArea?.y2}
            />
          )}
          <Scatter
            data={filteredData}
            shape={<CustomDot selectedPoint={selectedPoint} />}
          />
        </ScatterChart>
      </div>
    );
  }
}

export default Mainplot;
