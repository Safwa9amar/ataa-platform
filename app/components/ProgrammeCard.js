import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import Text from './Text';

export default ProgrammeCard = ({title, description, theme, img, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.cardContainer, { borderColor : theme.borderColor,backgroundColor: theme.mangoBlack}]}>
      <View style={styles.textContainer}>
        <Text>{title}</Text>
        <Text type="sm">{description}</Text>
      </View>
      {img}
    </TouchableOpacity>
  );
};
export const CustomImg = ({src}) => {
  return (
    <Image
      source={src}
      style={[styles.svg, {width: 90, height: 90, borderRadius: 10}]}
    />
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: '85%',
    height: 140,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    // add shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    marginRight: -15,
  },
  svg: {
    borderRadius: 10,
    zIndex: 100,
    transform: [{translateX: 25}],
    // add shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
