import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export default function CustomDropDown({
  handleChanges,
  data,
  valueField,
  labelField,
  value,
  icon,
}) {
  // Find the selected item based on the current value
  const selectedItem = data.find((item) => item[valueField] === value);

  return (
    <Menu>
      <MenuHandler>
        <Button variant="outlined" className="flex items-center gap-2">
          {icon}
          <span>
            {selectedItem ? selectedItem[labelField] : "Select Option"}
          </span>
        </Button>
      </MenuHandler>
      <MenuList>
        {data.map((item) => (
          <MenuItem key={item[valueField]} onClick={() => handleChanges(item)}>
            {item[labelField]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
