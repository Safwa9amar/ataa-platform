"use client";
import { Button as MTButton } from "@material-tailwind/react";
import React from "react";
import PropTypes from "prop-types";
function Button(props) {
  return <MTButton {...props}>{props.children}</MTButton>;
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  ripple: PropTypes.string,
  rounded: PropTypes.bool,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  iconOnly: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
