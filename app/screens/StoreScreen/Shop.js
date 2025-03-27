import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import SearchBar from "../../components/SearchBar";
import { useTheme } from "../../context/ThemeContext";
import StoreCard, {
  ProductCardStoreSkeletonLoader,
} from "../../components/ProductCardStore";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import CategoriesTabs from "./CategoriesTabs";
import RoundedIconGradientButton from "../../components/RoundedIconGradientButton";
import { useStore } from "../../context/StoreContext";
import ScreensContainer from "../../components/ScreensContainer";

export default function Shop({ navigation, route }) {
  const currentCategory = route.params?.category;
  const { theme } = useTheme();
  const { toggleNavbarOnScroll } = useHideNavbar();
  const { products, getALLProducts, searchProducts, loading, error } =
    useStore();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit, setLimit] = useState(10);

  // Load initial products
  useLayoutEffect(() => {
    navigation.setParams({ category: { name: "جميع الأصناف", id: 550 } });
    getALLProducts("", 1, limit);
  }, [navigation]);

  // Reset data on category change
  useEffect(() => {
    setData([]);
    setPage(1);
  }, [currentCategory]);

  // Update data when products change
  useEffect(() => {
    setData((prevData) => [...prevData, ...products]);
  }, [products]);

  const renderStoreCard = ({ item }) => (
    <StoreCard
      loading={loading}
      id={item.id}
      title={item.name}
      price={item.price}
      image={item.imgURL}
      handlePress={() => navigation.navigate("Product", { id: item.id })}
    />
  );

  const handleRefresh = () => {
    setData([]);
    setPage(1);
    getALLProducts("", 1, limit);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !products.length) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      if (currentCategory && currentCategory.id === 550) {
        // Load more products for "جميع الأصناف"
        await getALLProducts("", nextPage, limit);
      } else if (currentCategory) {
        // Load more products for the selected category
        await searchProducts(currentCategory.id, "", nextPage, limit);
      }
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more products:", error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = (keywords) => {
    setData([]);
    setPage(1);
    currentCategory.id === 550
      ? getALLProducts(keywords, 1, limit)
      : searchProducts(currentCategory.id, keywords, 1, limit);
  };

  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
      }
      onScroll={(e) => {
        try {
          const { contentOffset, layoutMeasurement, contentSize } =
            e.nativeEvent;
          const offsetY = contentOffset.y;
          const height = layoutMeasurement.height;
          const contentHeight = contentSize.height;

          // Trigger load more when the user scrolls close to the bottom
          if (offsetY + height >= contentHeight - 50) {
            handleLoadMore();
          }
        } catch (error) {
          console.error("Error handling scroll event:", error.message);
        }
      }}
    >
      <RoundedIconGradientButton
        text="الانتقال الى فرص تبرع المتجر"
        iconName="donate"
        iconColor="white"
        onPress={() => navigation.navigate("StoreDonationOpportunities")}
        gradientColors={["#22C6CB", "#01E441"]}
        gradientStart={{ x: 0, y: 0 }}
        gradientEnd={{ x: 1, y: 0 }}
        style={styles.headerButtonStyle}
      />
      <SearchBar fetchDataCallback={handleSearch} width="full" />

      <CategoriesTabs navigation={navigation} route={route} />

      <FlatList
        data={data}
        renderItem={renderStoreCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardStoreSkeletonLoader key={index} />
            ))}
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                gap: 10,
                justifyContent: "space-evenly",
              }}
            >
              <ProductCardStoreSkeletonLoader />
              <ProductCardStoreSkeletonLoader />
            </View>
          ) : null
        }
      />
    </ScreensContainer>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 100,
  },
  emptyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 10,
    justifyContent: "space-evenly",
  },
});
