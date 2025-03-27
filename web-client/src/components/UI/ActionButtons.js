import React from "react";
import { Button } from "@material-tailwind/react";

const ActionButtons = ({ handleOpen, applyFilters }) => {
  return (
    <>
      <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
        <span>الغاء</span>
      </Button>
      <Button variant="gradient" color="green" onClick={applyFilters}>
        <span>موافق</span>
      </Button>
    </>
  );
};

export default ActionButtons;
