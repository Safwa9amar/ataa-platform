import {Pressable, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../context/ThemeContext';
import Text from './Text';

export default function DonateNowBtn({width, onPress, style}) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: width,
        backgroundColor: theme.buttonPrimary,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        ...style,
      }}>
      <Text
        style={{
          color: 'white',
        }}
        type="sm">
        تبرع الان
      </Text>
    </TouchableOpacity>
  );
}
