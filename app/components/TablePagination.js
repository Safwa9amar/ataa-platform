import React from 'react';
import Icon from '../components/Icon';
import Text from '../components/Text';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const TablePagination = ({
  totalRecords,
  pageLimit,
  pageNeighbours,
  currentPage,
  onPageChanged,
}) => {
  const totalPages = Math.ceil(totalRecords / pageLimit);
  const {theme} = useTheme();
  const handleClick = page => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    onPageChanged({currentPage: newPage});
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={() => handleClick(1)}
        disabled={currentPage === 1}>
        <Icon.AntDesign
          name="doubleleft"
          size={20}
          color={currentPage === 1 ? 'grey' : theme.textColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}>
        <Icon.AntDesign
          name="left"
          size={20}
          color={currentPage === 1 ? 'grey' : theme.textColor}
        />
      </TouchableOpacity>
      <Text>{currentPage}</Text>
      <TouchableOpacity
        onPress={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <Icon.AntDesign
          name="right"
          size={20}
          color={currentPage === totalPages ? 'grey' : theme.textColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleClick(totalPages)}
        disabled={currentPage === totalPages}>
        <Icon.AntDesign
          name="doubleright"
          size={20}
          color={currentPage === totalPages ? 'grey' : theme.textColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
});