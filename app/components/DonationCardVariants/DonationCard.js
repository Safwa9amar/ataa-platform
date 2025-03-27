import React, { useEffect } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Linking,
} from "react-native";
import * as Progress from "react-native-progress";
import DonateNowBtn from "../DonateNowBtn";
import Text from "../Text";
import Icon from "../Icon";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import { useDonationModalContext } from "../../context/DonationModalContext";
import { useSavedDonationOpportunities } from "../../context/SavedDonationOpportunitiesContext";

const DonationCard = ({
  id,
  image,
  field,
  category,
  title,
  description,
  remainingAmount,
  progress,
  width = Dimensions.get("window").width - 20,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { toggleDonationModal } = useDonationModalContext();
  const { toggleSaveOpportunity, isOpportunitySaved } =
    useSavedDonationOpportunities();
  const { isInCart } = useCart();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(
          category.title === "kafalat"
            ? "KafalatDonationCardDetaills"
            : "DoantionCardDetaills",
          {
            DonationOpportunitieID: id,
          }
        )
      }
      style={[styles.container, { width }, { borderColor: theme.borderColor }]}
    >
      <ImageBackground
        style={styles.imageBackground}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        source={{ uri: image }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() =>
              toggleSaveOpportunity({
                id,
                image,
                title,
                description,
                remainingAmount,
                progress,
              })
            }
          >
            <Icon.FontAwesome
              name={isOpportunitySaved(id) ? "bookmark" : "bookmark-o"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
          {/* <Pressable>
            <Icon.Feather name="share-2" size={22} color="white" />
          </Pressable> */}
          <TouchableOpacity
            onPress={() => {
              addToCart({
                id: id,
                screen: "DoantionCardDetaills",
                type: "donation",
                priceEditable: true,
                price: 0,
              });
            }}
          >
            <Icon.MaterialCommunityIcons
              name={isInCart(id) ? "cart" : "cart-outline"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.descriptionContainer}>
          <Text type="sm" style={styles.descriptionText}>
            {description}
          </Text>
        </View>
      </ImageBackground>

      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}
      >
        <Progress.Bar
          style={styles.progressBar}
          animated={true}
          progress={progress / 100}
          width={300}
          height={5}
          color={progress / 100 < 0.5 ? "red" : "green"}
        />
        <Text style={{ alignSelf: "flex-start" }} type="sm">
          {progress.toFixed(0)}%
        </Text>
        <Text type="md">{title}</Text>
        <View style={styles.footerContainer}>
          <DonateNowBtn
            onPress={() => {
              toggleDonationModal();
              navigation.setParams({
                typeOfDonation:
                  category.title === "kafalat" ? "ikfalni" : "donateNow",
                donationData: {
                  id,
                  title,
                  fieldTitle: field.ar_title,
                  categoryTitle: category.ar_title,
                  image,
                },
              });
            }}
            width={100}
          />
          <Text type="sm">المبلغ المتبقي : {remainingAmount} دج </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 2,
  },
  imageBackground: {
    height: 350,
    width: "100%",
    borderRadius: 20,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "#00000040",
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    gap: 10,
  },
  descriptionContainer: {
    width: "100%",
    backgroundColor: "#00000055",
    padding: 20,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  descriptionText: {
    color: "white",
  },
  contentContainer: {
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
    gap: 10,
  },
  progressBar: {
    alignSelf: "center",
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default DonationCard;
