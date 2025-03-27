import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../components/Icon";
import { useTheme } from "../../../context/ThemeContext";
import DonationCardVariants from "../../../components/DonationCardVariants";
import TabItem from "../../../components/TabItem";
import { useCredentials } from "../../../context/CredentialsContext";
import AlertMessage from "../../../components/AlertMessage";
import Unlogged from "../../../components/Unlogged";
import { useCampaigns } from "../../../context/CampaignContext";
import Text from "../../../components/Text";
import DefaultSkeletonLoader from "../../../components/skeleton/DefaultSkeletonLoader";
import debounce from "lodash.debounce";
import SearchBar from "../../../components/SearchBar";
import CampaignsCardSkeleton from "../../../components/skeleton/CampaignsCardSkeleton";
import CustomScreenHeader from "../../../components/CustomScreenHeader";
import ScreensContainer from "../../../components/ScreensContainer";
import BloodDonationCardSkeleton from "../../../components/skeleton/BloodDonationCardSkeleton";

const BLOOD_TYPES = [
  { name: "A+", code: "A_POSITIVE" },
  { name: "A-", code: "A_NEGATIVE" },
  { name: "B+", code: "B_POSITIVE" },
  { name: "B-", code: "B_NEGATIVE" },
  { name: "O+", code: "O_POSITIVE" },
  { name: "O-", code: "O_NEGATIVE" },
  { name: "AB+", code: "AB_POSITIVE" },
  { name: "AB-", code: "AB_NEGATIVE" },
];

const campaignTypes = [
  { status: "all", ar_status: "الكل", color: "black" },
  { status: "URGENT", ar_status: "مستعجلة", color: "red" },
  { status: "NOT_URGENT", ar_status: "غير مستعجلة", color: "green" },
];

export default function UsersCampagnes() {
  const { theme } = useTheme();
  const { userToken, user, isLoggedIn } = useCredentials();
  const navigation = useNavigation();
  const [visibleItems, setVisibleItems] = useState([]);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 10 });
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setVisibleItems(viewableItems.map((item) => item.index));
  });

  const [activeTab, setActiveTab] = useState("all");
  const [progress, setProgress] = useState([0, 99]);
  const [keywords, setKeywords] = useState("");
  const {
    campaigns,
    error,
    loading,
    fetchUsersCampaigns: fetchCampaigns,
    nextPage,
    page,
    hasMore,
    resetCampaigns,
  } = useCampaigns();

  const getCampaigns = useCallback(async () => {
    await fetchCampaigns(
      {
        types: ["BLOOD"],
        status: activeTab,
        progress,
        keywords,
        page,
      },
      userToken
    );
  }, [page, activeTab, keywords]);

  useEffect(() => {
    resetCampaigns();
    isLoggedIn && getCampaigns();
  }, [activeTab, keywords]);

  useEffect(() => {
    return resetCampaigns;
  }, []);

  const handleEndReached = debounce(() => {
    return;
    if (hasMore) {
      nextPage();
      getCampaigns();
    }
  }, 300);

  const handleSearch = async (keywords) => {
    setKeywords(keywords);
  };

  if (!isLoggedIn) {
    return <Unlogged comeFrom="UsersCampagnes" navigation={navigation} />;
  }

  return (
    <ScreensContainer>
      <SearchBar
        fetchDataCallback={handleSearch}
        placeholderText="عنوان الحملة أو الوصف ..."
        width="95%"
      />
      <FlatList
        nestedScrollEnabled
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={isLoggedIn && getCampaigns}
          />
        }
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => {
          if (loading) {
            return [1, 2, 3].map((item) => (
              <BloodDonationCardSkeleton key={item} />
            ));
          }
          return (
            <>
              {error && (
                <AlertMessage
                  type="error"
                  message={"حدث خطأ ما يرجى اعادة تحديث الصفحة"}
                />
              )}
              {!loading && (
                <View style={{ alignSelf: "center", alignItems: "center" }}>
                  <Image
                    style={{ width: 350, height: 300 }}
                    source={require("../../../assets/images/nodata.png")}
                  />
                  <Text type="md">لا توجد حملات لعرضها</Text>
                </View>
              )}
            </>
          );
        }}
        renderItem={({ item, index }) => (
          <RenderCampaignCard
            visibleItems={visibleItems}
            item={item}
            index={index}
          />
        )}
        ListFooterComponent={() => (
          <>{loading && <BloodDonationCardSkeleton />}</>
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        onEndReachedThreshold={0.1}
        onEndReached={handleEndReached}
      />
    </ScreensContainer>
  );
}

const RenderCampaignCard = React.memo(({ item, index, visibleItems }) => {
  const navigation = useNavigation();
  return (
    <DonationCardVariants.BloodDonationCard
      isVisible={!visibleItems.includes(index)}
      image
      title={item.title}
      BloodType={
        BLOOD_TYPES.find((type) => type.code === item.selectedBloodType)?.name
      }
      remainingAmount={item.numberOfUnits}
      donatedUnits={item.donatedUnits}
      progress={item.progress.rate / 100}
      onPress={() => {
        navigation.navigate("MyBloodCampagnDetails", {
          campaignId: item.id,
        });
      }}
    />
  );
});
