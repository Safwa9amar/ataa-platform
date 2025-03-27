"use client";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

export default function ProgressCircle({ data }) {
  return (
    <CircularProgressbar
      className="w-20 h-20"
      styles={buildStyles({
        pathColor: "cayan",
        trailColor: "#EFE",
        textColor: "white",
      })}
      value={Math.floor(data?.progress.rate)}
      text={`${Math.floor(data?.progress.rate)}%`}
    />
  );
}
