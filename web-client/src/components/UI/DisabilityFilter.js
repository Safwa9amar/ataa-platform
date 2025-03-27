import React from "react";
import { Button } from "@material-tailwind/react";

const DisabilityFilter = ({ disability, setDisability, getButtonStyles }) => {
  return (
    <div>
      <label className="text-textColor font-ElMessiri">مخصص لذوي الاعاقة</label>
      <div className="flex gap-2">
        <Button
          {...getButtonStyles(disability === true)}
          onClick={() => setDisability(true)}
        >
          نعم
        </Button>
        <Button
          {...getButtonStyles(disability === false)}
          onClick={() => setDisability(false)}
        >
          لا
        </Button>
      </div>
    </div>
  );
};

export default DisabilityFilter;
