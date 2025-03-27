import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import CustomScreenHeader from "../components/CustomScreenHeader";
import Icon from "../components/Icon";
import { useTheme } from "../context/ThemeContext";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import { useCart } from "../context/CartContext";
import ScreensContainer from "../components/ScreensContainer";
import Text from "../components/Text";
import DonateNowBtn from "../components/DonateNowBtn";
import SwipableItem from "../components/SwipableItem";
import { useDonationModalContext } from "../context/DonationModalContext";
import API_ENDPOINTS, { CONSTANTS } from "../config/config";

const CartScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { setHideNavbar } = useHideNavbar();
  const editTimer = useRef(null);
  const { toggleDonationModal } = useDonationModalContext();

  const {
    cart,
    loading,
    addToCart,
    cartTotal,
    removeFromCart,
    deleteItemFromCart,
    editItemPrice,
    fetchCartData,
  } = useCart();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CustomScreenHeader
          icon={<Icon.Ionicons name="cart" size={20} color={theme.textColor} />}
          label="السلة"
          navigation={navigation}
        />
      ),
    });
    const focusListener = navigation.addListener("focus", () =>
      setHideNavbar(true)
    );
    fetchCartData();
    return () => {
      focusListener();
      setHideNavbar(false);
    };
  }, [navigation, setHideNavbar, theme.textColor]);

  const handleEditItemPrice = (itemId, text) => {
    if (editTimer.current) {
      clearTimeout(editTimer.current);
    }
    editTimer.current = setTimeout(() => {
      editItemPrice(itemId, text);
    }, 2000);
  };

  const renderItem = ({ item }) => (
    <SwipableItem
      key={item.id}
      rightActions={
        <Icon.AntDesign name="delete" size={32} color={theme.CARROT} />
      }
      leftActions={
        item.type === "donation" && (
          <TextInput
            // on press check key in keyboard

            keyboardType="numeric"
            onChangeText={(text) => handleEditItemPrice(item, text)}
            style={styles.textInput(theme)}
            placeholder={"المبلغ"}
          />
        )
      }
      onDelete={() => deleteItemFromCart(item.id)}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(item.screen, { DonationOpportunitieID: item.id })
        }
        style={styles.itemContainer(theme.borderColor, theme.mangoBlack)}
      >
        {item.type === "store" && (
          <View style={styles.quantityContainer}>
            <Icon.Ionicons
              name="remove-circle"
              size={28}
              color={theme.buttonPrimary}
              onPress={() => removeFromCart(item.id)}
            />
            <Text type="md" style={styles.quantity(theme.textColor)}>
              {item.quantity}
            </Text>
            <Icon.Ionicons
              name="add-circle"
              size={28}
              color={theme.buttonPrimary}
              onPress={() => addToCart({ id: item.id, type: item.type })}
            />
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text type="sm" style={styles.title(theme.textColor)}>
            {item.title}
          </Text>
          {item.category && (
            <Text type="sm" style={styles.title(theme.textColor)}>
              {item.category.name}
            </Text>
          )}
          <Text type="md" style={styles.price(theme.textColor)}>
            {(item.price * item.quantity).toFixed(2)}{" "}
            {process.env.APP_CURRENCY_NAME}
          </Text>
          {item.type === "donation" && (
            <Text type="xs">اسحب لليمين لتعديل مبلغ التبرع</Text>
          )}
        </View>
        <Image
          source={
            item.imgURL || item.cardImage
              ? { uri: item.imgURL || item.cardImage }
              : require("../assets/logo/fullLogo.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>
    </SwipableItem>
  );

  if (loading) {
    return (
      <ScreensContainer>
        <ActivityIndicator size="large" color={theme.primary} />
      </ScreensContainer>
    );
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={cart}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyCartContainer}>
            <Image
              source={require("../assets/images/emptyCart.jpg")}
              style={styles.emptyCartImage}
            />
            <Text type="md">السلة فارغة</Text>
          </View>
        }
      />
      <View style={styles.footer(theme)}>
        <DonateNowBtn
          onPress={() => {
            toggleDonationModal();
            navigation.setParams({
              typeOfDonation: "donateNow",
              donationData: {
                id: "",
                title: "سلة التبرع",
                fieldTitle: "",
                categoryTitle: "",
                image: API_ENDPOINTS.APP.GUID + "/assets/fullLogo.png",
                cartData: cart,
                cartTotal: `المبلغ الكلي للسلة من اجل التبرع : ${cartTotal} ${process.env.APP_CURRENCY_NAME}`,
                cartTotalAmount: parseFloat(cartTotal),
                donationType: CONSTANTS.DONATION_TYPES.CART,
              },
            });
          }}
          width={110}
        />
        <Text type="md" style={styles.price(theme.textColor)}>
          المجموع: {cartTotal} {process.env.APP_CURRENCY_NAME}
        </Text>
      </View>
    </>
  );
};

const styles = {
  itemContainer: (borderColor, bgColor) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    backgroundColor: bgColor,
    marginTop: 10,
    borderRadius: 10,
    width: "95%",
  }),
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    objectFit: "contain",
  },
  detailsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: (textColor) => ({
    color: textColor,
  }),
  price: (textColor) => ({
    color: textColor,
  }),
  quantityContainer: {
    alignItems: "center",
  },
  quantity: (textColor) => ({
    color: textColor,
    marginHorizontal: 10,
  }),
  textInput: (theme) => ({
    backgroundColor: theme.mangoBlack,
    color: theme.textColor,
    padding: 10,
    borderRadius: 10,
    width: 100,
    textAlign: "center",
  }),
  flatListContent: {
    paddingBottom: 60,
  },
  emptyCartContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    margin: 20,
  },
  footer: (theme) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.mangoBlack,
    height: 60,
    padding: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  }),
};

export default CartScreen;
