import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function ArrowDownSvg(props) {
  return (
    <Svg
      width={125}
      height={97}
      viewBox="0 0 125 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={28.5}
        y={1}
        width={68}
        height={68}
        rx={34}
        stroke="#B9B9B9"
        strokeWidth={2}
      />
      <Path
        d="M61.44 46.093a1.5 1.5 0 002.12 0l9.546-9.546a1.5 1.5 0 10-2.12-2.121L62.5 42.91l-8.485-8.485a1.5 1.5 0 00-2.122 2.121l9.546 9.546zM61 25v20.032h3V25h-3z"
        fill="#B9B9B9"
      />
    </Svg>
  )
}

export default ArrowDownSvg
