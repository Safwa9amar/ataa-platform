import React from "react";
import { Button } from "@material-tailwind/react";

const ChildrenFilter = ({ children, setChildren, getButtonStyles }) => {
  return (
    <div>
      <label className="text-textColor font-ElMessiri">عدد الابناء</label>
      <div className="flex gap-2 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <Button
            key={i}
            {...getButtonStyles(children === i)}
            onClick={() => setChildren(i)}
          >
            {i}
          </Button>
        ))}
        <Button
          {...getButtonStyles(children === 100)}
          onClick={() => setChildren(100)}
        >
          اكثر
        </Button>
      </div>
    </div>
  );
};

export default ChildrenFilter;
