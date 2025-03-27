import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const Text = ({
  children,
  style,
  fontSize,
  fontFamily,
  type = 'bodyText',
  left,
  right,
  center,
  color,
  ...restProps
}) => {
  const {theme} = useTheme();

  const textStyles = {
    // Body Text
    bodyText: 20,
    bodyTextSmall: 16,
    bodyTextExtraSmall: 10,

    // Navigation Text
    navigationText: 14,

    // Headings
    headingExtraLarge: 52,
    headingLarge: 36,
    headingMedium: 32,
    headingSmall: 24,
    headingExtraSmall: 18,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
  };
  // const fontsLoaded = useLoadFonts();

  const dynamicStyles = {
    textAlign: left ? 'left' : right ? 'right' : center ? 'center' : 'auto',
    color: color ? color  : theme.textColor,
    fontSize: fontSize ? fontSize : textStyles[type],
    fontFamily: fontFamily ? fontFamily : styles.text.fontFamily,
  };

  return (
    <RNText style={[styles.text, dynamicStyles, style]} {...restProps}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default styles for your Text component
    fontSize: 16, // Default font size
    fontFamily: 'ElMessiri', // Default font family
    // wrap text
    // You can add other default styles here
  },
});

export default Text;
