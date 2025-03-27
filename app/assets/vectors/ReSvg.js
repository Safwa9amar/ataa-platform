import * as React from "react";
import Svg, { Rect } from "react-native-svg";

function ReSVG(props) {
  return (
    <Svg
      width={95}
      height={8}
      viewBox="0 0 95 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={95} height={8} rx={4} fill="#D9D9D9" />
    </Svg>
  );
}

export default ReSVG;
