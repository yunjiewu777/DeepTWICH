import React from "react";

const RADIUS_SELECTED = 6;
const RADIUS_UNSELECTED = 3;
const COLOR_SELECTED = "green";
const COLOR_UNSELECTED = "red";

export default function CustomDot(props) {
  const { cx, cy, payload, selectedPoint } = props;
  const isSelected =
    selectedPoint["embed_two"][0] === payload["embed_two"][0] &&
    selectedPoint["embed_two"][1] === payload["embed_two"][1];

  return (
    <g
      className="custom-dot"
      data-chart-x={cx}
      data-chart-y={cy}
      data-x-value={payload["embed_two"][0]}
      data-y-value={payload["embed_two"][1]}
      data-radius={isSelected ? RADIUS_UNSELECTED : RADIUS_SELECTED}
    >
      {!isSelected ? (
        <circle cx={cx} cy={cy} r={RADIUS_UNSELECTED} fill={COLOR_UNSELECTED} />
      ) : (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={RADIUS_SELECTED / 2}
            fill={COLOR_SELECTED}
          />
          <circle
            cx={cx}
            cy={cy}
            r={RADIUS_SELECTED}
            fill="none"
            stroke={COLOR_SELECTED}
          />
        </>
      )}
    </g>
  );
}
