import {View} from 'react-native';
import React from 'react';
import Text from './Text';

export default function Badges({
  bgColor = '#A42530',
  width = 100,
  height = 26,
  title,
  textType = 'sm',
  style,
}) {
  return (
    <View
      style={[
        {
          backgroundColor: bgColor,
          width: width,
          height: height,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      <Text
        type={textType}
        style={{
          color: 'white',
        }}>
        {title}
      </Text>
    </View>
  );
}
