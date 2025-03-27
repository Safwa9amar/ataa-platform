import React from "react";
import { Slider } from "@material-tailwind/react";

const AgeFilter = ({ age, handleSliderChange }) => {
  return (
    <div dir="rtl" className="w-72">
      <label className="text-textColor font-ElMessiri">العمر {age}</label>
      <Slider defaultValue={age} onChange={handleSliderChange} />
    </div>
  );
};

export default AgeFilter;
