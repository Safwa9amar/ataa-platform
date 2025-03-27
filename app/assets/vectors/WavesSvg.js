import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function WaveSvg(props) {
  return (
    <Svg
      width={430}
      height={111}
      viewBox="0 0 430 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M160 14.5C64.5-2 24.333 31.833 1 44.5V109h428.5s113-60.5 47-76S370 44.5 290 44.5c-54 0-41.946-14.787-130-30z"
        fill="#AEFDEC"
      />
      <Path
        d="M160 24C299.5-15.5 395.5-.667 429.5 32l4.5 80L.5 106-14 37.5C.333 52.5 45.34 56.467 160 24z"
        fill="#40FFD6"
        fillOpacity={0.3}
      />
    </Svg>
  );
}

export default WaveSvg;
