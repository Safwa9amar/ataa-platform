import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";

const TabItem = ({ isActive, onClick, bgColor = "gray-200", icon, label }) => {
  return (
    <Button
      onClick={onClick}
      color={isActive ? "indigo" : "gray"}
      className={
        "flex items-center justify-center gap-2 px-4 py-2 mx-2 rounded-full font-ElMessiri transition-all"
      }
      style={{ minWidth: "100px" }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
};

TabItem.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
};

TabItem.defaultProps = {
  isActive: false,
  bgColor: "gray-200",
  icon: null,
};

export default TabItem;
