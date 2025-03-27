import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function VerticalSvg(props) {
  return (
    <Svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.167 12.5h10.5m-10.5 6h10.5m-10.5 6h10.5"
        stroke="#7A7A7A"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M29.167 30.5l4.5-4.5m-4.5 4.5l-4.5-4.5m4.5 4.5v-24m0 0l-4.5 4.5m4.5-4.5l4.5 4.5"
        stroke="#7A7A7A"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default VerticalSvg;
