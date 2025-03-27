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
import CustomScreenHeader from "../../../components/CustomScreenHeader";
import Icon from "../../../components/Icon";
import { useTheme } from "../../../context/ThemeContext";
import CampaignsCard from "../../../components/CampaignsCard";
import CircularProgress from "react-native-circular-progress-indicator";
import TabItem from "../../../components/TabItem";
import { useCredentials } from "../../../context/CredentialsContext";
import AlertMessage from "../../../components/AlertMessage";
import Unlogged from "../../../components/Unlogged";
import { useCampaigns } from "../../../context/CampaignContext";
import Text from "../../../components/Text";
import DefaultSkeletonLoader from "../../../components/skeleton/DefaultSkeletonLoader";
import debounce from "lodash.debounce";
import CampaignsCardSkeleton from "../../../components/skeleton/CampaignsCardSkeleton";

const campaignTypes = [
  { status: "all", ar_status: "الكل", color: "black" },
  { status: "URGENT", ar_status: "مستعجلة", color: "red" },
  { status: "NOT_URGENT", ar_status: "غير مستعجلة", color: "green" },
  { status: "ONGOING", ar_status: "صدقة جارية", color: "blue" },
];

export default function MyCampaigns() {
  const { theme } = useTheme();
  const { userToken, user, isLoggedIn } = useCredentials();
  const navigation = useNavigation();
  const [visibleItems, setVisibleItems] = useState([]);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 10 });
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setVisibleItems(viewableItems.map((item) => item.index));
  });
  const [activeTab, setActiveTab] = useState("all");
  const {
    nextPage,
    page,
    hasMore,
    resetCampaigns,
    campaigns,
    error,
    loading,
    fetchCampaignsByUserId,
  } = useCampaigns();

  const getCampaigns = useCallback(async () => {
    await fetchCampaignsByUserId(
      user.id,
      {
        types: ["GOODS", "MONEY"],
        status: activeTab,
        progress: [0, 99],
        keywords: "",
        page,
      },
      userToken
    );
  }, [activeTab, page]);

  useEffect(() => {
    console.log("fetch my campgns", {
      types: ["GOODS", "MONEY"],
      status: activeTab,
      progress: [0, 99],
      keywords: "",
      page,
    });
    resetCampaigns();
    getCampaigns();
  }, [activeTab]);

  useEffect(() => {
    return resetCampaigns;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader
          icon={
            <Icon.Ionicons name="megaphone" size={20} color={theme.textColor} />
          }
          navigation={navigation}
          label="حملاتي"
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

  if (!isLoggedIn) {
    return <Unlogged comeFrom="MyCampagns" navigation={navigation} />;
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={getCampaigns} />
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
          return [1, 2, 3].map((item) => <CampaignsCardSkeleton key={item} />);
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
      // ListFooterComponent={() => (
      //   <>
      //     {loading && (
      //       <ActivityIndicator size="large" color={theme.primaryColor} />
      //     )}
      //   </>
      // )}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
      onEndReachedThreshold={0.1}
      onEndReached={handleEndReached}
    />
  );
}

const RenderCampaignCard = React.memo(({ item, index, visibleItems }) => {
  const navigation = useNavigation();
  return (
    <CampaignsCard
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
    </CampaignsCard>
  );
});
