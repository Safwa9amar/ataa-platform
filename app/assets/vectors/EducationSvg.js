import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function EducationSvg(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      {...props}
    >
      <G
        filter="url(#filter0_d_772_712)"
        fill="#F75178"
        clipPath="url(#clip0_772_712)"
      >
        <Path
          opacity={0.2}
          d="M30.375 15.9v7.484c0 .275-.1.541-.281.747-1.59 1.77-5.47 5.119-12.094 5.119-6.623 0-10.502-3.348-12.094-5.119a1.125 1.125 0 01-.281-.747V15.9L18 22.5l12.375-6.6z"
        />
        <Path d="M35.404 12.507l-16.875-9a1.125 1.125 0 00-1.058 0l-16.875 9a1.125 1.125 0 000 1.986L4.5 16.575v6.81a2.237 2.237 0 00.571 1.497c1.842 2.052 5.97 5.493 12.93 5.493a18.28 18.28 0 006.75-1.232v4.607a1.125 1.125 0 102.25 0v-5.694a16.259 16.259 0 003.928-3.174c.369-.412.572-.945.571-1.498v-6.809l3.904-2.082a1.125 1.125 0 000-1.986zM18 28.125c-6.085 0-9.664-2.973-11.25-4.74v-5.61l10.721 5.718a1.125 1.125 0 001.058 0l6.221-3.318v6.517c-1.772.827-4.005 1.433-6.75 1.433zm11.25-4.746A13.756 13.756 0 0127 25.383v-6.409l2.25-1.2v5.605zm-2.812-6.653l-.031-.018-7.875-4.201a1.125 1.125 0 00-1.058 1.986L24.047 18 18 21.224 3.516 13.5 18 5.775 32.484 13.5l-6.046 3.226z" />
      </G>
      <Defs>
        <ClipPath id="clip0_772_712">
          <Path fill="#fff" d="M0 0H36V36H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default EducationSvg;
