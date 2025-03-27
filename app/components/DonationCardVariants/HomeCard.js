import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Badges from "../Badges";
import Text from "../Text";
import { useNavigation } from "@react-navigation/native";

export default function HomeCard({
  id,
  image,
  category,
  badgeColor,
  badgeTitlte,
  title,
  remainingAmount,
  width = 300,
  styles,
}) {
  const navigation = useNavigation();
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
      style={{
        height: 500,
        width: width,
        margin: 10,
        borderRadius: 20,
        borderColor: "#B5B3B320",
        borderWidth: 2,
        ...styles,
      }}
    >
      <Image
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 20,
        }}
        source={image}
      />
      <View
        style={{
          position: "absolute",
          height: 160,
          bottom: 0,
          width: "100%",
          backgroundColor: "#00000055",
          padding: 20,
          borderRadius: 20,
          gap: 10,
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Badges width={150} bgColor={badgeColor} title={badgeTitlte} />
        <Text
          type="md"
          style={{
            color: "white",
          }}
        >
          {title}
        </Text>
        <Text
          type="sm"
          style={{
            color: "white",
          }}
        >
          المبلغ المتبقي : {remainingAmount} دج{" "}
          {/* Use the 'remainingAmount' prop */}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
