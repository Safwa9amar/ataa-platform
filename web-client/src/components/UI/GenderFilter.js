import React from "react";
import { Button } from "@material-tailwind/react";
import { IoMaleOutline } from "react-icons/io5";
import { IoIosFemale } from "react-icons/io";

const GenderFilter = ({ gender, setGender, theme, getButtonStyles }) => {
  return (
    <div>
      <label className="text-textColor font-ElMessiri">الجنس</label>
      <div className="flex gap-2">
        <Button
          {...getButtonStyles(gender === "male")}
          onClick={() => setGender("male")}
        >
          <p>ذكر</p>
          <IoMaleOutline
            size={20}
            color={gender === "male" ? "white" : theme.textColor}
          />
        </Button>
        <Button
          {...getButtonStyles(gender === "female")}
          onClick={() => setGender("female")}
        >
          <p>انثى</p>
          <IoIosFemale
            size={20}
            color={gender === "female" ? "white" : theme.textColor}
          />
        </Button>
      </div>
    </div>
  );
};

export default GenderFilter;
