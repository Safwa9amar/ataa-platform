import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ToastAndroid,
  View,
} from "react-native";

// Custom components and hooks
import DonationCard from "../../components/DonationCardVariants/DonationCard";
import DonationScreenTabs from "./components/DonationScreenTabs";
import CarouselTabs from "./components/CarouselTabs";
import { SearchAndFilter } from "../../components/SearchAndFilter";
import ModelWrapper from "../../components/ModelWrapper";
import DefaultSkeletonLoader from "../../components/skeleton/DefaultSkeletonLoader";

// Context and hooks
import { useHideNavbar } from "../../context/NavbarVisibilityContext";

// Modals and filters
import GeneraleProjectsFilter from "../../modal/GeneraleProjectsFilter";
import CaringMosquesFilter from "../../modal/CaringMosquesFilter";
import JudicialEnfFilter from "../../modal/JudicialEnfFilter";
import RelivedFilter from "../../modal/RelivedFilter";
import FactureFilter from "../../modal/FactureFilter";
import OrphanFilter from "../../modal/OrphanFilter";
import IskanFilter from "../../modal/IskanFilter";

// Assets
import SonalgazSvg from "../../assets/vectors/SonalgazSvg";
import JusticeSvg from "../../assets/vectors/JusticeSvg";
import EauSvg from "../../assets/vectors/EauSvg";

// Configuration
import API_ENDPOINTS from "../../config/config";
import Text from "../../components/Text";
import ScreensContainer from "../../components/ScreensContainer";
import { getAllDonationOpportunities } from "../../services/donationOpportunityService";
import { useCredentials } from "../../context/CredentialsContext";

// Define constants outside of the component to prevent re-creation on every render
const INITIAL_TAB_DATA = {
  Projects: [
    { label: "الكل", name: "all", withFilter: false },
    { label: "مشاريع عامة", name: "Project", withFilter: true },
    { label: "اسكان", name: "iskan", withFilter: true },
    { label: "كفالة ايتام", name: "kafalat", withFilter: true },
    { label: "العناية بالمساجد", name: "masajed", withFilter: true },
  ],
  Tayasart: [
    { label: "الكل", name: "all", withFilter: false },

    {
      label: "فواتير الكهرباء و الغاز",
      name: "sonalgaz",
      icon: <SonalgazSvg />,
      withFilter: true,
    },
    { label: "فواتير المياه", name: "ade", icon: <EauSvg />, withFilter: true },
    {
      label: "التنفيذ القضائي",
      name: "justice",
      icon: <JusticeSvg />,
      withFilter: true,
    },
  ],
  Forejat: [
    {
      label: "Forejat",
      name: "all",
      isActive: true,
      withFilter: true,
      hide: true,
    },
  ],
  Eghatha: [
    {
      label: "Eghatha",
      name: "all",
      isActive: true,
      withFilter: true,
      hide: true,
    },
  ],
};

const DonationScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState("Projects");
  const [currentTab, setCurrentTab] = useState("all");
  const [withFilter, setWithFilter] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const { toggleNavbarOnScroll, setHideNavbar } = useHideNavbar();
  const [donationData, setDonationData] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [progress, setProgress] = useState(null);
  const { userToken } = useCredentials();

  const [isHorizontal, setIsHorizontal] = useState(false);
  useEffect(() => {
    currentTab !== "all" && resetState();
    setProgress(null);
  }, [currentScreen]);

  useEffect(() => {
    setFilterData({});
    setProgress(null);
  }, [currentTab]);

  const resetState = () => {
    setFilterData({});
    setCurrentTab("all");
  };

  const closeModel = () => setShowModel(false);
  const openModel = () => setShowModel(true);

  const renderDonationCard = ({ item }) => (
    <DonationCard
      field={item.field}
      category={item.category}
      key={item.id}
      id={item.id}
      title={item.title}
      remainingAmount={item.progress.requiredAmount - item.progress.totalAmount}
      progress={item.progress.rate}
      description={item.description}
      image={API_ENDPOINTS.BASE_URL + "/uploads/" + item.images[0].filename}
    />
  );

  const renderFilterModalContent = () => {
    switch (currentTab) {
      case "Project":
        return (
          <GeneraleProjectsFilter
            closeModel={closeModel}
            setFilterData={setFilterData}
          />
        );
      case "iskan":
        return (
          <IskanFilter closeModel={closeModel} setFilterData={setFilterData} />
        );
      case "kafalat":
        return (
          <OrphanFilter closeModel={closeModel} setFilterData={setFilterData} />
        );
      case "masajed":
        return (
          <CaringMosquesFilter
            closeModel={closeModel}
            setFilterData={setFilterData}
          />
        );
      case "ade":
      case "sonalgaz":
        return (
          <FactureFilter
            closeModel={closeModel}
            setFilterData={setFilterData}
          />
        );
      case "justice":
        return (
          <JudicialEnfFilter
            closeModel={closeModel}
            setFilterData={setFilterData}
          />
        );
      case "Forejat":
        return (
          <RelivedFilter
            closeModel={closeModel}
            setFilterData={setFilterData}
          />
        );
      default:
        return null;
    }
  };

  const handleSearch = (value) => {
    if (value.length <= 3) {
      setKeywords("");
      return ToastAndroid.show(
        "كلمة البحث يجب ان تتكون من 4 احرف فأكثر",
        ToastAndroid.SHORT
      );
    }
    setKeywords(value);
  };

  let getData = async () => {
    try {
      setDonationData([]);
      setLoading(true);
      let data = await getAllDonationOpportunities(
        currentScreen,
        currentTab,
        filterData,
        keywords,
        progress,
        userToken
      );
      setDonationData(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [currentScreen, currentTab, filterData, keywords, progress]);
  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getData} />
      }
      onScrollEndDrag={toggleNavbarOnScroll}
    >
      <View style={styles.container}>
        <DonationScreenTabs
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
        <CarouselTabs
          currentTab={currentTab}
          setWithFilter={setWithFilter}
          setCurrentTab={setCurrentTab}
          tabsData={INITIAL_TAB_DATA[currentScreen]}
        />
        <SearchAndFilter
          setProgress={setProgress}
          isHorizontal={isHorizontal}
          setIsHorizontal={setIsHorizontal}
          handleSearch={handleSearch}
          withFilter={withFilter}
          currentTab={currentTab}
          ShowFilterModal={withFilter && currentTab ? openModel : null}
        />
      </View>
      <FlatList
        inverted={isHorizontal}
        horizontal={isHorizontal}
        nestedScrollEnabled={true}
        scrollEnabled={isHorizontal}
        contentContainerStyle={styles.listContainer}
        data={donationData}
        renderItem={renderDonationCard}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <>
            {loading ? (
              [1, 2, 3].map((idx) => (
                <DefaultSkeletonLoader
                  key={idx}
                  borderRadius={10}
                  height={500}
                  width="90%"
                >
                  <DefaultSkeletonLoader height={200} width={"90%"} />
                  <DefaultSkeletonLoader height={90} width={"90%"} />
                  <DefaultSkeletonLoader height={10} width={"90%"} />
                  <DefaultSkeletonLoader height={50} width={"90%"} />
                </DefaultSkeletonLoader>
              ))
            ) : donationData?.length === 0 ? (
              <View style={{ alignSelf: "center", alignItems: "center" }}>
                <Image
                  style={{ width: 350, height: 300 }}
                  source={require("../../assets/images/nodata.png")}
                />
                <Text>لا توجد فرص لعرضها</Text>
              </View>
            ) : null}
          </>
        }
      />
      <ModelWrapper closeModel={closeModel} isModelOpen={showModel}>
        {renderFilterModalContent()}
      </ModelWrapper>
    </ScreensContainer>
  );
};

const styles = {
  container: {
    gap: 2,
    marginTop: 20,
  },
  listContainer: {
    gap: 10,
    marginTop: 20,
  },
};

export default DonationScreen;
