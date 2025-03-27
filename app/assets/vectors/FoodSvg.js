import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FoodSvg(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      {...props}
    >
      <Path
        d="M14.22 27.9l2.16 6.043m-2.16-6.042l-4.5-1.106m4.5 1.105l2.751-3.728M5.091 2.495l.875 2.417m1.568 15.814l4.5 1.132 2.777-3.729m-9.437-3.446l4.5 1.106 2.752-3.703M3.189 8.64l4.5 1.106 2.777-3.728m13.988 20.34l-1.44 5.785m1.44-5.785l-2.905-3.189m2.905 3.189l4.037-1.44m1.98-22.86l-.565 2.314m-6.917 13.011l2.88 3.189 4.063-1.466m-5.503-7.508l2.88 3.188 4.063-1.466m-5.503-7.508L28.749 9l4.063-1.465"
        stroke="#EB8308"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FoodSvg;
