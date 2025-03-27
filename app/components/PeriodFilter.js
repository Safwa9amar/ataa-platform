import { memo, useCallback, useState } from "react";
import convertPeriodToDate from "../utils/convertPeriodToDate";
import { FlatList, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Text from "./Text";

const PeriodFilter = ({ onDateSelected }) => {
  const { theme } = useTheme();
  const times = ["كل الأوقات", "اليوم", "الأسبوع", "الشهر", "السنة"].reverse();
  const [activePeriodFilterItem, setActivePeriodFilterItem] = useState(4);

  // Memoized callback for handling item selection
  const handleItemPress = useCallback(
    (index) => {
      setActivePeriodFilterItem(index);
      const selectedDate = convertPeriodToDate(times[index]);
      console.log(selectedDate);
      if (onDateSelected) onDateSelected(selectedDate);
    },
    [times, onDateSelected]
  );

  // Memoized component for rendering each period filter item
  const PeriodFilterItem = memo(({ time, index }) => {
    const isActive = activePeriodFilterItem === index;
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(index)}
        style={{
          marginHorizontal: 10,
          borderBottomWidth: isActive ? 2 : 0,
          borderBottomColor: theme.secondaryColor,
        }}
      >
        <Text color={theme.steel} fontSize={15}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        data={times}
        renderItem={({ item, index }) => (
          <PeriodFilterItem time={item} index={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default PeriodFilter;
