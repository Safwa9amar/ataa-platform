import {
  I18nManager,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import Text from "../../components/Text";
import { useStore } from "../../context/StoreContext";

export default function CategoriesTabs({ navigation, route }) {
  const scrollRef = useRef();
  const { categories, searchProducts, getALLProducts } = useStore();
  categories.forEach((category) => {
    delete category.products;
  });

  // UseEffect to handle scroll to the selected category
  React.useEffect(() => {
    if (categories.length > 0) {
      const index = categories.findIndex(
        (cat) => cat.id === route.params?.category.id
      );
      console.log("index", index);
      if (index !== -1) {
        scrollRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.1,
          viewOffset: 0,
        });
      }
    }
  }, [categories, route.params?.category]);
  // Function to handle layout information
  const getItemLayout = (data, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  // Handle failed scroll attempt
  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      scrollRef.current.scrollToIndex({ index: info.index, animated: true });
    });
  };

  // Define item width for layout calculations
  const ITEM_WIDTH = 50; // Adjust this value based on your item width
  const handleCategoryPress = (item) => {
    console.log("item", item);
    navigation.setParams({ category: item });
    if (item.id === 550) {
      getALLProducts("", 1, 10);
    } else {
      searchProducts(item.id, "", 1, 10);
    }
  };

  const renderCategoryItem = ({ item, index }) => (
    <CategoryItem
      key={index}
      item={item}
      isActive={route.params?.category.id === item.id}
      onPress={() => handleCategoryPress(item)}
    />
  );

  if (categories.length === 0) return null;
  return (
    <FlatList
      inverted
      getItemLayout={getItemLayout}
      onScrollToIndexFailed={onScrollToIndexFailed}
      ref={scrollRef}
      data={categories}
      horizontal
      renderItem={renderCategoryItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.categoryContainer}
    />
  );
}

const CategoryItem = ({ item, isActive, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[
        styles.categoryItem,
        { backgroundColor: isActive ? theme.buttonPrimary : theme.mangoBlack },
        { borderBottomColor: isActive ? "black" : "transparent" },
      ]}
    >
      <Text center color={isActive ? "white" : ""} type={"sm"}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    height: 50,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  categoryItem: {
    width: 100,
    // borderBottomWidth: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
});
