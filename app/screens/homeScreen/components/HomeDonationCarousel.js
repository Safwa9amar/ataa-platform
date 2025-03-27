import React, { useEffect } from "react";
import { View, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import Text from "../../../components/Text";
import DonationCard from "../../../components/DonationCardVariants";
import img5 from "../../../assets/images/image5.png";
import API_ENDPOINTS from "../../../config/config";
import { useNavigation } from "@react-navigation/native";

export default function HomeDonationCarousel({ donationData }) {

  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <DonationCard.HomeCard
      id={item.id}
      category={item.category}
      badgeTitlte={item.category.ar_title}
      title={item.title}
      remainingAmount={
        item.progress?.requiredAmount - item.progress?.totalAmount
      }
      badgeColor={item.field.color}
      image={{
        uri: API_ENDPOINTS.BASE_URL + "/uploads/" + item.images[0].filename,
      }}
    />
  );

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("DonationScreen")}>
          <Text style={{ color: "#B9B9B9" }} type="bodyTextSmall">
            عرض المزيد
          </Text>
        </TouchableOpacity>
        <Text>فرص التبرع</Text>
      </View>
      <FlatList
        inverted
        data={donationData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
}
