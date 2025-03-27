import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SendSvg({ fill, size }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: size || 24,
        height: size || 24,
        aspectRatio: 1,
      }}
    >
      <Path
        d="M20 18.5v-5.154L14.154 12 20 10.654V5.5L4.577 12 20 18.5z"
        fill={fill || "#000"}
      />
    </Svg>
  );
}

export default SendSvg;
