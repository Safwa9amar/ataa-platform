import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Text from "./Text";

const TypingText = ({
  text = "Default Typing Animated Text.",
  color = "rgb(77, 192, 103)",
  textSize = "md",
  typingAnimationDuration = 50,
  blinkingCursorAnimationDuration = 190,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [blinkingCursorColor, setBlinkingCursorColor] = useState("transparent");

  const indexRef = useRef(0);
  const typingTimerRef = useRef(null);
  const blinkingCursorTimerRef = useRef(null);

  useEffect(() => {
    typingAnimation();
    blinkingCursorAnimation();

    return () => {
      clearTimeout(typingTimerRef.current);
      clearInterval(blinkingCursorTimerRef.current);
    };
  }, []);

  const typingAnimation = () => {
    clearTimeout(typingTimerRef.current);

    if (indexRef.current < text.length) {
      setDisplayedText((prev) => prev + text.charAt(indexRef.current));
      indexRef.current++;

      typingTimerRef.current = setTimeout(
        typingAnimation,
        typingAnimationDuration
      );
    } else {
      clearInterval(blinkingCursorTimerRef.current);
      setBlinkingCursorColor("transparent");
    }
  };

  const blinkingCursorAnimation = () => {
    blinkingCursorTimerRef.current = setInterval(() => {
      setBlinkingCursorColor((prev) =>
        prev === "transparent" ? color : "transparent"
      );
    }, blinkingCursorAnimationDuration);
  };

  return (
    <Text color={color} {...props} type={textSize}>
      {displayedText}
      <Text style={{ color: blinkingCursorColor }}>|</Text>
    </Text>
  );
};

TypingText.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  textSize: PropTypes.number,
  typingAnimationDuration: PropTypes.number,
  blinkingCursorAnimationDuration: PropTypes.number,
};

export default TypingText;
