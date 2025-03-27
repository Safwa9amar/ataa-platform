import * as React from 'react';
import Svg, {G, Circle, Path} from 'react-native-svg';
export default function MoonSvg() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}>
      <G fill="none" stroke="currentColor" strokeWidth={1.5}>
        <Circle cx={12} cy={12} r={10} />
        <Path d="M7.633 3.067A3.001 3.001 0 114.017 6.32M22 13.05a3.5 3.5 0 10-3 5.914" />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.5 8.51l.01-.011M10 17a2 2 0 100-4 2 2 0 000 4"
        />
      </G>
    </Svg>
  );
}
