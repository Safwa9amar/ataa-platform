import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useLayoutEffect } from "react";
import ScreensContainer from "../components/ScreensContainer";
import Badges from "../components/Badges";
import { useTheme } from "../context/ThemeContext";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import CustomScreenHeader from "../components/CustomScreenHeader";
import { useSavedDonationOpportunities } from "../context/SavedDonationOpportunitiesContext";
import SwipableItem from "../components/SwipableItem";
import Icon from "../components/Icon";
import AnimatedCampaignsCard from "../components/CampaignsCard";

// TODO get saved opportunities from the server by the user id and display them here
export default function SavedOpportunities() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { setHideNavbar } = useHideNavbar();
  const { savedOpportunities, removeOpportunity } =
    useSavedDonationOpportunities();

  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      header: () => (
        <CustomScreenHeader
          label={"الفرص المحفوظة"}
          theme={theme}
          navigation={navigation}
        />
      ),
    });
    return () => {
      setHideNavbar(false);
    };
  }, [navigation]);
  return (
    <FlatList
      data={savedOpportunities}
      renderItem={({ item }) => (
        <SwipableItem
          key={item.id}
          rightActions={
            <Icon.Entypo name="trash" size={30} color={theme.primaryColor} />
          }
          onDelete={() => removeOpportunity(item.id)}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <AnimatedCampaignsCard
              // item={{
              //   Ionicons: true,
              //   iconName: "heart",
              // }}
              onPress={() =>
                navigation.navigate("DoantionCardDetaills", {
                  DonationOpportunitieID: item.id,
                })
              }
              image={{ uri: item.cardImage }}
              label={item.title}
              description={item.description}
            />
          </View>
        </SwipableItem>
      )}
      keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
      contentContainerStyle={{ gap: 10, marginHorizontal: 10 }} // This helps to manage spacing between items
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingRight: 10,
    overflow: "hidden",
  },
  image: {
    height: 130,
    width: 130,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 10,
  },
});
