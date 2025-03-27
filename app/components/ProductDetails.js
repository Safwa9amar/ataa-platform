import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import { useTheme } from "../context/ThemeContext";
import ScreensContainer from "./ScreensContainer";
import Text from "./Text";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import DefaultSkeletonLoader from "./skeleton/DefaultSkeletonLoader";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/storeService";
import { useCredentials } from "../context/CredentialsContext";
import MyMarkDown from "./MyMarkdown";

export default function ProductDetails({ navigation, route }) {
  const { theme } = useTheme();
  const { cart, addToCart } = useCart();
  const { setHideNavbar } = useHideNavbar();
  const { userToken } = useCredentials();

  const [product, setProduct] = useState({
    title: "Loading...",
    description: "Loading...",
    price: "Loading...",
  });

  const productID = route.params.id;
  
  const quantity =
    cart.filter((item) => item.id === productID)[0]?.quantity || "";
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    console.log("gettin prod bu id");
    setLoading(true);
    let data = await getProductById(productID, userToken);
    if (data) {
      console.log(data);
      setProduct(data);
      setLoading(false);
    }
  }, [productID]);

  useLayoutEffect(() => {
    fetchProduct();
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [fetchProduct, setHideNavbar]);

  useEffect(() => {
    navigation.setOptions({
      statusBarColor: theme.secondaryColor,
      // set white color fot status bar icons
      statusBarStyle: "light-content",
    });
  }, [(product, navigation)]);

  const handleAddToCart = () => {
    addToCart({
      id: productID,
      type: "store",
      screen: "Product",
      priceEditable: false,
    });
  };
  return (
    <>
      <ScreensContainer style={styles.container}>
        <View
          style={[
            styles.backButtonContainer,
            { backgroundColor: theme.mangoBlack },
          ]}
        >
          <Icon.Ionicons
            onPress={navigation.goBack}
            name="arrow-back"
            size={28}
            color={theme.textColor}
          />
        </View>

        {loading ? (
          <DefaultSkeletonLoader height={350} />
        ) : (
          product && (
            <ProductImage imageUri={product?.image} productID={productID} />
          )
        )}
        {product &&
          (loading ? (
            <View style={{ alignItems: "flex-end" }}>
              <DefaultSkeletonLoader width={150} height={20} />
              <DefaultSkeletonLoader width={200} height={20} />
              <DefaultSkeletonLoader height={120} />
            </View>
          ) : (
            <View style={{ padding: 10, gap: 10 }}>
              <Text
                style={{ fontWeight: "bold" }}
                color={theme.secondaryColor}
                type="xl"
              >
                {product.price} {process.env.APP_CURRENCY_NAME}
              </Text>
              <Text type="xl" style={styles.productTitle}>
                {product.title}
              </Text>
              <MyMarkDown>{product.description}</MyMarkDown>
            </View>
          ))}
      </ScreensContainer>
      <View style={[styles.footer, { backgroundColor: theme.mangoBlack }]}>
        {loading ? (
          <>
            <DefaultSkeletonLoader height={40} />
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleAddToCart}
              style={[
                styles.addToCartButton,
                { backgroundColor: theme.secondaryColor },
              ]}
            >
              <Text type="md" color={theme.white}>
                اضافة الى السلة {quantity}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("StoreDonationOpportunities")}
              style={styles.donationButton}
            >
              <Text type="sm">عرض فرص تبرع المتجر</Text>
              {/* // TODO : Add donation screen for the store */}
              <Icon.FontAwesome5
                name="box-open"
                size={24}
                color={theme.primaryColor}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  backButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
    padding: 10,
    borderBottomRightRadius: 20,
  },

  productTitle: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addToCartButton: {
    padding: 10,
    height: "100%",
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  donationButton: {
    padding: 10,
    height: "100%",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
});
