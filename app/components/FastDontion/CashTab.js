import React from 'react';
import { View,  Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Text from '../Text';
import { shadowStyles } from './shadowStyles';

const CashTab = () => {
  const { theme } = useTheme();

  return (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <Text style={{ color: theme.textColor }}>
        قيد التطوير
      </Text>
     
    </View>
  );
};

export default CashTab;
