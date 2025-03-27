import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const SwitchWithIcon = ({onImage, offImage, onToggle}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const {toggleTheme, isDarkMode} = useTheme();
  const toggleSwitch = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle && onToggle(newState);
    toggleTheme();
  };
  useLayoutEffect(() => {
    setIsEnabled(!isDarkMode);
  }, [isDarkMode]);
  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      style={[
        styles.containerSwitch,
        {backgroundColor: !isDarkMode ? '#fff' : '#222'},
      ]}>
      <View
        style={[
          styles.circle,
          {transform: [{translateX: isEnabled ? 18 : 0}]},
        ]}>
        <ImageBackground
          source={isEnabled ? onImage : offImage}
          style={styles.imageBackground}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerSwitch: {
    borderRadius: 15,
    width: 40,
    height: 20,
    justifyContent: 'center',
  },
  circle: {
    width: 25,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    width: 15,
    height: 15,
    top: 7,
  },
});

export default SwitchWithIcon;
