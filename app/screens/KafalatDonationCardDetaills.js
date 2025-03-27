import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import { useTheme } from "../context/ThemeContext";
import { useAppContext } from "../context/AppContext";
import ScreensContainer from "../components/ScreensContainer";
import Badges from "../components/Badges";
import Text from "../components/Text";
import Icon from "../components/Icon";
import * as Progress from "react-native-progress";
import Carousel from "react-native-snap-carousel";
// import Share from "react-native-share";
import { useDonationModalContext } from "../context/DonationModalContext";
import API_ENDPOINTS, { CONSTANTS } from "../config/config";
import DefaultSkeletonLoader from "../components/skeleton/DefaultSkeletonLoader";
import PrimaryBtn from "../components/PrimaryBtn";
import MyMarkDown from "../components/MyMarkdown";
import { getDonationOpportunityById } from "../services/donationOpportunityService";
import useElapsedTime from "../hooks/useElapsedTime";
import { useSavedDonationOpportunities } from "../context/SavedDonationOpportunitiesContext";
import useShareDonationOpportunity from "../hooks/useShareDonationOpportunity";
import { reverseCalculateSponsorshipAmount } from "../utils/calculateOrphaneDonationAmount";
import { Slider } from "@miblanchard/react-native-slider";
const KafalatDonationCardDetaills = ({ navigation, route }) => {
  const oppertunityId = route.params.DonationOpportunitieID;
  const { setHideNavbar } = useHideNavbar();
  const { theme } = useTheme();
  const { carouselLayout } = useAppContext();
  const dimensions = Dimensions.get("screen");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleDonationModal } = useDonationModalContext();
  const [duration, setDuration] = useState({
    duration: 0,
    period: "",
  });
  // const [headerColor, setHeaderColor] = useState("");
  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      headerShown: false,
      // statusBarColor: `rgb(${headerColor})`,
    });
    return () => setHideNavbar(false);
  }, [navigation, setHideNavbar]);
  const getData = async () => {
    try {
      setLoading(true);
      let data = await getDonationOpportunityById(oppertunityId);
      console.log(data.progress.totalAmount);
      
      if (data) {
        setDuration(
          reverseCalculateSponsorshipAmount(data.progress.totalAmount)
        );
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const refrech = () => {
    getData().finally(() => setLoading(false));
    navigation.setParams({ refrech: false });
  };
  useEffect(() => {
    getData().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (route.params.refrech) {
      refrech();
    }
  }, [route.params.refrech]);

  if (loading || !data.id)
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refrech} />
        }
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonLogo}
            source={require("../assets/logo/logoText.png")}
          />
          <Icon.AntDesign
            name="arrowright"
            size={24}
            color={theme.buttonPrimary}
          />
        </TouchableOpacity>
        <DefaultSkeletonLoader width="100%" height={300} />
        <DefaultSkeletonLoader width="100%" height={100} />
        <DefaultSkeletonLoader width="100%" height={10} />
        <DefaultSkeletonLoader width="100%" height={150} />
        <DefaultSkeletonLoader width="100%" height={50} />
        <DefaultSkeletonLoader width="100%" height={50} />
      </ScrollView>
    );
  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refrech} />
      }
    >
      <View style={styles.imageContainer}>
        <Carousel
          style={styles.carousel}
          data={
            data.images ? data.images : [{ id: 1, filename: data.cardImage }]
          }
          renderItem={({ item }) => (
            <Image
              source={{ uri: API_ENDPOINTS.UPLOADS + "/" + item.filename }}
              style={styles.mainImage}
            />
          )}
          sliderWidth={dimensions.width}
          itemWidth={dimensions.width}
          autoplay
          loop
          layout={carouselLayout}
          autoplayInterval={3000}
        />
        <Badges
          style={styles.badges}
          width={180}
          height={35}
          title={data.category?.ar_title}
          textType="md"
          bgColor={data.field?.color}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonLogo}
            source={require("../assets/logo/logoText.png")}
          />
          <Icon.AntDesign
            name="arrowright"
            size={24}
            color={theme.buttonPrimary}
          />
        </TouchableOpacity>
      </View>
      <HeaderContainer theme={theme} data={data} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <Text type="md">
          {duration.duration} {duration.period}
        </Text>
        <Text type="md">تم التكفل به لمدة</Text>
      </View>
      <Slider
        thumbTintColor={theme.CARROT}
        containerStyle={{ width: 300, height: 40, alignSelf: "center" }}
        maximumValue={data.progress?.requiredAmount}
        value={data.progress?.totalAmount}
        disabled
      />
      <Description overview={data.overview || data.description} />

      {!!data.infoSectionsCards &&
        data.infoSectionsCards
          .filter((item) => item.show)
          .map((item) => <InfoSectionsCard key={item.id} item={item} />)}

      {!!data.infoSections &&
        data.infoSections
          .filter((section) => section.show)
          .map((section) => (
            <InfoSection key={section.id} title={section.title}>
              {section.infoBlocks
                .filter((block) => block.show)
                .map((block) => (
                  <InfoBlock
                    key={block.id}
                    title={block.subtitle.toString()}
                    subtitle={block.title}
                  />
                ))}
            </InfoSection>
          ))}
      <InfoSection>
        <InfoBlock subtitle={"عدد عمليات التبرع"} title={data.donationCount} />
        <InfoBlock
          subtitle={"عدد المستفيدين"}
          title={data.numberBeneficiaries}
        />
        <InfoBlock subtitle={"عدد الزيارات"} title={data.visits} />
      </InfoSection>

      {data.progress && data.progress.rate < 100 && (
        <PrimaryBtn
          onPress={() => {
            toggleDonationModal();
            navigation.setParams({
              typeOfDonation: "ikfalni",
              donationData: {
                id: data.id,
                title: data.title,
                fieldTitle: data.field.ar_title,
                categoryTitle: data.category.ar_title,
                image: data.cardImage,
                donationType: CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY,
              },
            });
          }}
          title="اكفلني"
        />
      )}
      <Image
        source={require("../assets/logo/fullLogo.png")}
        style={styles.footerImage}
      />
    </ScreensContainer>
  );
};

const HeaderContainer = ({ theme, data }) => {
  const { customText } = useElapsedTime(data.lastDonation);
  const { toggleSaveOpportunity, isOpportunitySaved } =
    useSavedDonationOpportunities();
  const shareDonationOpportunity = useShareDonationOpportunity();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconRow}>
        <TouchableOpacity
          onPress={() =>
            toggleSaveOpportunity({
              id: data.id,
              title: data.title,
              image: data.cardImage,
              description: data.description,
            })
          }
        >
          <View style={styles.iconRow}>
            <Icon.FontAwesome
              name={isOpportunitySaved(data.id) ? "bookmark" : "bookmark-o"}
              size={22}
              color={theme.steel}
            />
            <Icon.Feather
              onPress={() => shareDonationOpportunity(data, "facebook")}
              name="share-2"
              size={22}
              color={theme.steel}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.headerTextContainer}>
        <Text type="lg">{data.title}</Text>
        <Text type="sm" right color="#225570">
          {data.id}#
        </Text>
        <Text type="sm" color={theme.steel}>
          اخر عملية تبرع {customText}
        </Text>
        <Text type="sm" color={theme.secondaryColor}>
          شارك الفرصة على منصات التواصل الاجتماعي واحصل على نقاط سفراء عطاء
        </Text>
      </View>
    </View>
  );
};

const ProgressBar = ({ dimensions, title, color, rate }) => (
  <View style={styles.progressContainer}>
    <Progress.Bar
      style={styles.progressBar}
      animated
      borderWidth={0}
      color={color}
      width={dimensions.width - 40}
      progress={rate / 100}
    />
    <View style={styles.progressTextContainer}>
      <Text type="md">{title}</Text>
      <Text type="md">{rate + "%"}</Text>
    </View>
  </View>
);

const Description = ({ overview }) => {
  if (overview?.length <= 0) return null;
  return (
    <View style={styles.descriptionText}>
      <MyMarkDown>{overview}</MyMarkDown>
    </View>
  );
};
const InfoSectionsCard = ({ item }) => {
  try {
    let data = JSON.parse(item.data)[0];
    if (data.length < 0) return null;

    const { theme } = useTheme();
    const renderKeyValuePairs = () => {
      return Object.entries(data).map(([key, value]) => {
        if (key === "title" || key === "image" || key === "id") return null;
        const renderValue = () => {
          if (typeof value === "string" && value.includes("http")) {
            const isMapLink = value.includes("maps");
            const IconComponent = isMapLink
              ? Icon.MaterialCommunityIcons
              : Icon.Feather;
            const iconName = isMapLink ? "map-marker-radius" : "external-link";

            return (
              <IconComponent
                onPress={() => Linking.openURL(value)}
                name={iconName}
                size={18}
                color={theme.BONKER_PINK}
              />
            );
          }
          return value;
        };

        return (
          <Text key={key} type="sm">
            {`${key} : `}
            <Text type="sm" color={theme.steel}>
              {renderValue()}
            </Text>
          </Text>
        );
      });
    };
    return (
      <InfoSection title={item.title}>
        <View>{renderKeyValuePairs()}</View>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.partnerImage} />
        )}
      </InfoSection>
    );
  } catch (error) {
    return null;
  }
};

const InfoSection = ({ children, title = null }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.cardContainer, { borderColor: theme.secondaryColor }]}>
      {title && (
        <Text
          type="md"
          style={[styles.cardTitle, { backgroundColor: theme.backgroundColor }]}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

const InfoBlock = ({ title, subtitle }) => (
  <View style={styles.infoBlock}>
    <Text type="md">{title}</Text>
    <Text type="sm">{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    gap: 20,
  },
  mainImage: {
    width: "100%",
    height: 300,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  badges: {
    position: "absolute",
    top: 280,
    left: 40,
  },
  backButton: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonLogo: {
    width: 50,
    height: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  headerTextContainer: {
    width: "75%",
    alignItems: "flex-end",
    gap: 5,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressBar: {
    alignSelf: "center",
    backgroundColor: "lightgray",
  },
  progressTextContainer: {
    width: Dimensions.get("screen").width - 40,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    margin: 10,
  },
  descriptionText: {
    marginHorizontal: 20,
  },
  donateNowBtn: {
    alignSelf: "center",
  },
  footerImage: {
    alignSelf: "center",
    width: 300,
    height: 200,
    borderRadius: 50,
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  cardTitle: {
    position: "absolute",
    top: -15,
    right: 20,
    paddingHorizontal: 5,
  },
  infoBlock: {
    alignItems: "center",
  },
});

export default KafalatDonationCardDetaills;
