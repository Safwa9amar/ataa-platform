import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function HorizentalSvg(props) {
  return (
    <Svg
      width={37}
      height={37}
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M5 20.5h26m-26 5h26m-26 5h26"
        stroke="#7A7A7A"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M30 12l-4.5-4.5M30 12l-4.5 4.5M30 12H6m0 0l4.5 4.5M6 12l4.5-4.5"
        stroke="#7A7A7A"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default HorizentalSvg;
