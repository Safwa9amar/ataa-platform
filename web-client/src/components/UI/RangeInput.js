import React from "react";
import { Slider } from "@material-tailwind/react";

const RangeInput = ({ label, value, handleSliderChange }) => {
  return (
    <div dir="rtl" className="w-72">
      <label className="text-textColor font-ElMessiri">
        {label} {value}
      </label>
      <Slider max={12} defaultValue={value} onChange={handleSliderChange} />
    </div>
  );
};

export default RangeInput;
