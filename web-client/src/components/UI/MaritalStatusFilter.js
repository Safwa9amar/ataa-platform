import React from "react";
import { Button } from "@material-tailwind/react";

const MaritalStatusFilter = ({
  maritalStatus,
  setMaritalStatus,
  getButtonStyles,
}) => {
  return (
    <div>
      <label>الحالة الاجتماعية</label>
      <div className="flex gap-2">
        <Button
          {...getButtonStyles(maritalStatus === "maried")}
          onClick={() => setMaritalStatus("maried")}
        >
          متزوج
        </Button>
        <Button
          {...getButtonStyles(maritalStatus === "single")}
          onClick={() => setMaritalStatus("single")}
        >
          اعزب
        </Button>
      </div>
    </div>
  );
};

export default MaritalStatusFilter;
