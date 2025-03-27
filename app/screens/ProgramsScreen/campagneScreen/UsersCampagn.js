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
import AnimatedCampaignsCard from "../../../components/CampaignsCard";
import CircularProgress from "react-native-circular-progress-indicator";

const campaignTypes = [
  { status: "all", ar_status: "الكل", color: "black" },
  { status: "URGENT", ar_status: "مستعجلة", color: "red" },
  { status: "NOT_URGENT", ar_status: "غير مستعجلة", color: "green" },
  { status: "ONGOING", ar_status: "صدقة جارية", color: "blue" },
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
        types: ["GOODS", "MONEY"],
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
    getCampaigns();
  }, [activeTab, keywords]);

  useEffect(() => {
    return resetCampaigns;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader
          icon={
            <Icon.Ionicons name="people" size={20} color={theme.textColor} />
          }
          navigation={navigation}
          label="حملات المستخدمين"
        />
      ),
    });
  }, [navigation, theme]);

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

  const handleRefrech = () => {
    resetCampaigns();
    getCampaigns();
  };

  if (!isLoggedIn) {
    return <Unlogged comeFrom="UsersCampagnes" navigation={navigation} />;
  }

  return (
    <>
      <SearchBar
        fetchDataCallback={handleSearch}
        placeholderText="عنوان الحملة أو الوصف ..."
        width="95%"
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefrech} />
        }
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 100,
        }}
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <FlatList
            data={campaignTypes}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            inverted
            contentContainerStyle={{
              padding: 10,
            }}
            renderItem={({ item }) => (
              <TabItem
                icon={item.icon}
                bg={activeTab === item.status ? item.color : null}
                isActive={activeTab === item.status}
                label={item.ar_status}
                onPress={() => {
                  resetCampaigns();
                  setActiveTab(item.status);
                }}
              />
            )}
            extraData={activeTab}
          />
        )}
        ListEmptyComponent={() => {
          if (loading) {
            return [1, 2, 3].map((item) => (
              <CampaignsCardSkeleton key={item} />
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
        ListFooterComponent={() => <>{loading && <CampaignsCardSkeleton />}</>}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        onEndReachedThreshold={0.1}
        onEndReached={handleEndReached}
      />
    </>
  );
}

const RenderCampaignCard = React.memo(({ item, index, visibleItems }) => {
  const navigation = useNavigation();
  return (
    <AnimatedCampaignsCard
      isVisible={!visibleItems.includes(index)}
      iconName={"checkmark"}
      Ionicons
      label={item.title}
      description={` حالة الحملة : ${
        item.campaignStatus === "URGENT"
          ? "مستعجلة"
          : item.campaignStatus === "NOT_URGENT"
          ? "غير مستعجلة"
          : "صدقة جارية"
      }${
        item.CampaignType === "GOODS" || item.CampaignType === "BLOOD"
          ? "\n عدد الوحدات المستهدفة : " + item.numberOfUnits + " وحدة"
          : item.campaignStatus === "ONGOING"
          ? "\n المبلغ المجموع : " + item.progress.totalAmount + " دج"
          : "\n المبلغ المستهدف : " + item.targetAmount + " دج"
      }`}
      onPress={() =>
        navigation.navigate("MyCampaignDetails", { campaignId: item.id })
      }
    >
      {item.campaignStatus !== "ONGOING" && (
        <CircularProgress
          value={item.progress.rate}
          radius={25}
          activeStrokeColor={
            item.campaignStatus === "URGENT"
              ? "red"
              : item.campaignStatus === "NOT_URGENT"
              ? "green"
              : "blue"
          }
          activeStrokeWidth={3}
          inActiveStrokeWidth={4}
          valueSuffix={"%"}
        />
      )}
    </AnimatedCampaignsCard>
  );
});
