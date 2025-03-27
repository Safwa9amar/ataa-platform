import * as React from "react";

function ReligiousSvg(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      {...props}
    >
      <path
        d="M10.5 12h15c.45 0 .9.15 1.2.15.15-.45.3-1.05.3-1.5 0-1.95-.9-3.75-2.55-4.8L18 1.5l-6.45 4.2C10.05 6.9 9 8.7 9 10.65c0 .6.15 1.05.3 1.5.3 0 .75-.15 1.2-.15zM36 10.5C36 8.85 33 6 33 6s-3 2.85-3 4.5c0 1.05.6 2.1 1.5 2.55v6.45h-3v-3c0-1.65-1.35-3-3-3h-15c-1.65 0-3 1.35-3 3v3h-3v-6.45c.9-.45 1.5-1.5 1.5-2.55C6 8.85 3 6 3 6s-3 2.85-3 4.5c0 1.05.6 2.1 1.5 2.55V31.5H15v-6c0-1.65 1.35-3 3-3s3 1.35 3 3v6h13.5V13.05c.9-.45 1.5-1.5 1.5-2.55z"
        fill="#EB0867"
      />
    </svg>
  );
}

export default ReligiousSvg;
