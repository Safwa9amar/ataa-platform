import React from "react";

export default function FlipCard({
  front,
  back,
  onClick,
  width = "w-64", // Default width (adjustable via props)
  height = "h-80", // Default height (adjustable via props)
  className,
}) {
  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer perspective ${width} ${height} ${className}`}
    >
      <div className="card__content  text-center relative p-8 transition-transform duration-500 text-white font-bold transform-style-3d">
        {/* Front Side */}
        <div className="card__front absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center backface-hidden">
          {front}
        </div>

        {/* Back Side */}
        <div className="card__back  absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center  rotate-y-180 backface-hidden">
          {back}
        </div>
      </div>
    </div>
  );
}
