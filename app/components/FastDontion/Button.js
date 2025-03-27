import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';
import Text from '../Text';

const Button = ({ title, activeBtn, setActiveBtn }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => setActiveBtn(title)}
      style={[
        styles.button,
        {
          backgroundColor:
            activeBtn === title ? theme.buttonPrimary : theme.mangoBlack,
        },
      ]}>
      <Text type="sm" style={activeBtn === title && { color: theme.white }}>
        {title}
      </Text>
    </Pressable>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  activeBtn: PropTypes.string.isRequired,
  setActiveBtn: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
});

export default Button;
