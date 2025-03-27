import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SearchSvg(props) {
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 36 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12.526 20.923L2.94 30.51M15.648 24.045L6.06 33.632"
        stroke="#7A7A7A"
      />
      <Path
        d="M6.06 33.631a2.207 2.207 0 01-3.12 0M2.94 30.51a2.207 2.207 0 000 3.121M33.842 12.662a9.933 9.933 0 11-19.866 0 9.933 9.933 0 0119.866 0zM12.526 20.923l3.122 3.122M14.087 22.484l2.798-2.799M9.862 23.587l3.121 3.122M29.428 12.662a5.518 5.518 0 01-5.519 5.518"
        stroke="#7A7A7A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SearchSvg;
