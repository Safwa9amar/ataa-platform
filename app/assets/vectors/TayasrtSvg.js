import * as React from 'react';
import Svg, {G, Path, Defs} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function TayasrtSvg(props) {
  const {isDarkMode} = useTheme();
  return (
    <Svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G filter="url(#filter0_di_3154_774)">
        <Path
          d="M23.592 7v2.34m3.58-.958l-.738 1.383m4.105 0l-1.368 1.488m3.053 2.233c-.337 0-1.263.213-1.684.32m2.842 3.083h-2.21m.63 3.721l-1.262-.638m-1.685 2.34l1.369 1.488m-3.79.32l.527 1.062m-3.369-.531v1.701M23.592 7.106v2.34m-3.694-.957l.76 1.382m-4.237 0l1.412 1.489m-3.15 2.232c.347 0 1.303.213 1.738.32m-2.934 3.083h2.282m-.652 3.722l1.304-.638m1.738 2.339l-1.412 1.489m3.911.319l-.543 1.063m3.477-.532v1.701"
          stroke={isDarkMode ? 'white' : '#2C3333'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.31 36.212l-.034.029v2.658l-1.473 1.276-7.053-8.506 1.79-1.277 1.368.32 5.402 5.5z"
          fill="#FFB774"
        />
        <Path
          d="M9.908 30.712l3.263-3.084h4.842l2.421 1.063 4.632-.212v3.19h-7.053m-8.105-.957l-1.369-.32L6.75 31.67l7.053 8.506 1.473-1.276V36.24l.632-.532h8.842l5.368-3.084 2.316-4.465h-3.263l-1.895 2.232m-17.368.32l5.43 5.529"
          stroke={isDarkMode ? 'white' : '#2C3333'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M21.276 15.825l2.393 2.127 2.45-2.127"
          stroke={props.active ? '#FFF' : '#00BCD4'}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <Path
          d="M47.592 40.388l-1.474.212-4.526 5.317-.526 1.7L42.539 49l6.211-7.868-1.158-.744z"
          fill="#FFB774"
        />
        <Path
          d="M41.592 45.917l-1.053-.957h-8.736l-4.527-2.978-1.79-3.296 2.948-.212 1.474 2.233m11.684 5.21l-.526 1.7L42.539 49l6.211-7.868-1.158-.744-1.474.212m-4.526 5.317l4.526-5.317m-7.368.744h-5.684l-.105-2.552 3.157-.106 1.895-.744h5.053l3.052 2.658"
          stroke={isDarkMode ? 'white' : '#2C3333'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default TayasrtSvg;
