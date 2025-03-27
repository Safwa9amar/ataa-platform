import React, { useEffect, useRef, useState, useCallback } from "react";
import { FlatList, Image, RefreshControl, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CircularProgress from "react-native-circular-progress-indicator";

import ScreensContainer from "../../../components/ScreensContainer";
import Text from "../../../components/Text";
import { useTheme } from "../../../context/ThemeContext";
import DonationScreenTabs from "../../DonationScreen/components/DonationScreenTabs";
import CarouselTabs from "../../DonationScreen/components/CarouselTabs";
import { SearchAndFilter } from "../../../components/SearchAndFilter";
import { useHideNavbar } from "../../../context/NavbarVisibilityContext";
import JusticeSvg from "../../../assets/vectors/JusticeSvg";
import EauSvg from "../../../assets/vectors/EauSvg";
import SonalgazSvg from "../../../assets/vectors/SonalgazSvg";
import SearchBar from "../../../components/SearchBar";
import AnimatedCampaignsCard from "../../../components/CampaignsCard";
import CampaignsCardSkeleton from "../../../components/skeleton/CampaignsCardSkeleton";
import { getAllDonationOpportunities } from "../../../services/donationOpportunityService";
import { useCredentials } from "../../../context/CredentialsContext";

export default function CompletedOpportunities() {
  const { userToken } = useCredentials();
  const [donationData, setDonationData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setVisibleItems(viewableItems.map((item) => item.index));
  });

  const getData = useCallback(
    async (field = "all", category = "all", title = "") => {
      try {
        setDonationData([]); // Show skeleton while loading
        const data = await getAllDonationOpportunities(
          field,
          category,
          {},
          title,
          100,
          userToken
        );

        setDonationData(data);
      } catch (error) {
        console.error("Error fetching donation opportunities:", error);
      }
    },
    [userToken]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  const handleSearch = (text) => {
    if (!text) {
      getData();
      return;
    }
    const [field, category, title] = text.replace(/\s/g, "").split("،");
    getData(field, category, title);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  console.log("donationData");

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        padding: 10,
        paddingBottom: 100,
      }}
      ListHeaderComponent={
        <>
          <Image
            style={{
              width: "100%",
              height: 200,
              marginBottom: 10,
              borderRadius: 10,
            }}
            source={require("../../../assets/images/comletedOpertinitie.png")}
          />
          <SearchBar
            fetchDataCallback={handleSearch}
            placeholderText="تصنيف الفرصة،صنفها الثانوي ، عنوانها"
            width={"95%"}
          />
        </>
      }
      data={donationData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <RenderCampaignCard
          visibleItems={visibleItems}
          item={item}
          index={index}
        />
      )}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
      ListEmptyComponent={<CampaignsCardSkeleton />}
      onEndReachedThreshold={0.5}
    />
  );
}

const RenderCampaignCard = ({ item, index, visibleItems }) => {
  const navigation = useNavigation();

  return (
    <AnimatedCampaignsCard
      isVisible={visibleItems.includes(index)}
      iconName="checkmark"
      Ionicons
      label={item.title}
      description={`${item.description.slice(1, 20)}\n حالة الحملة : مكتملة`}
      onPress={() =>
        navigation.navigate("DoantionCardDetaills", {
          DonationOpportunitieID: item.id,
        })
      }
    >
      {item.campagnStatus !== "ongoing" && (
        <CircularProgress
          value={item.progress.rate}
          radius={25}
          activeStrokeWidth={3}
          inActiveStrokeWidth={4}
          valueSuffix="%"
        />
      )}
    </AnimatedCampaignsCard>
  );
};
