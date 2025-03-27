import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from "react-native";
import { useHideNavbar } from "../../../context/NavbarVisibilityContext";
import { useTheme } from "../../../context/ThemeContext";
import { useAppContext } from "../../../context/AppContext";
import ScreensContainer from "../../../components/ScreensContainer";
import Badges from "../../../components/Badges";
import Text from "../../../components/Text";
import Icon from "../../../components/Icon";
import * as Progress from "react-native-progress";
import Carousel from "react-native-snap-carousel";
// import Share from "react-native-share";
import { useDonationModalContext } from "../../../context/DonationModalContext";
import DefaultSkeletonLoader from "../../../components/skeleton/DefaultSkeletonLoader";
import PrimaryBtn from "../../../components/PrimaryBtn";
import MyMarkDown from "../../../components/MyMarkdown";

import { getCampaignById } from "../../../services/campaignServices";
import API_ENDPOINTS, { CONSTANTS } from "../../../config/config";
import { useCredentials } from "../../../context/CredentialsContext";
import getElapsedTime from "../../../utils/getElpasedTime";
import { Platform } from "react-native";
import { ToastAndroid } from "react-native";
import { useRoute } from "@react-navigation/native";
import ModelWrapper from "../../../components/ModelWrapper";
import RapportModal from "../../../modal/RapportModal";
import { Button } from "../../../components/ButtonWithLabel";

const MyCampaignDetails = ({ navigation }) => {
  const route = useRoute();
  const campaignId = route.params.campaignId;
  const { userToken } = useCredentials();
  const { setHideNavbar } = useHideNavbar();
  const { theme } = useTheme();
  const { carouselLayout } = useAppContext();
  const dimensions = Dimensions.get("screen");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleDonationModal } = useDonationModalContext();
  const [modalVisibility, setModalVisibility] = useState(false);
  // const [headerColor, setHeaderColor] = useState("");
  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      headerShown: false,
      // statusBarColor: `rgb(${headerColor})`,
    });
    return () => setHideNavbar(false);
  }, [navigation, setHideNavbar]);

  const handleShare = () => {
    // Share.open({
    //   url: `${process.env.WEBSITE_URL}/donation/${data.id}`,
    // }).catch((err) => console.log(err));
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      const data = await getCampaignById(campaignId, userToken);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    }
  };
  useEffect(() => {
    getDetails();
  }, [campaignId]);

  useEffect(() => {
    getDetails();
  }, [route.params]);
  if (loading)
    return (
      <>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {/* <Image
            style={styles.backButtonLogo}
            source={require("../../../assets/logo/logoText.png")}
          /> */}
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
      </>
    );
  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getDetails} />
      }
    >
      <View style={styles.imageContainer}>
        {Platform !== "web" && (
          <Carousel
            style={styles.carousel}
            data={data.images}
            renderItem={({ item }) => (
              <Image
                source={{
                  uri: API_ENDPOINTS.UPLOADS + "/" + item.filename,
                }}
                style={styles.mainImage}
              />
            )}
            sliderWidth={dimensions.width}
            itemWidth={dimensions.width}
            autoplay
            loop
            layout={carouselLayout}
            autoplayInterval={3000}
            // onBeforeSnapToItem={() => console.log("drag")}
            // onBeforeSnapToItem={(idx) => setHeaderColor(data.images[idx].colors)}
          />
        )}
        {/* {data.CampaignType !== "BLOOD" &&
          data.campaignStatus === "ONGOING" &&
          (data.categoryId || data.fieldId ? (
            <Badges
              style={styles.badges}
              width={180}
              height={35}
              title={
                data.categoryId ? data.category?.ar_title : data.field?.ar_title
              }
              textType="md"
              bgColor={data.field?.color}
            />
          ) : null)} */}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            style={styles.backButtonLogo}
            source={require("../../../assets/logo/logoText.png")}
          />
          <Icon.AntDesign
            name="arrowright"
            size={24}
            color={theme.buttonPrimary}
          />
        </TouchableOpacity>
      </View>
      <HeaderContainer handlePress={handleShare} theme={theme} data={data} />

      {data.campaignStatus !== "ONGOING" && (
        <ProgressBar
          // color={data.field.color}
          dimensions={dimensions}
          theme={theme}
          rate={data.progress.rate.toFixed(0) / 100}
          title={`${data.progress.totalAmount} ${process.env.APP_CURRENCY_NAME}`}
          progress={data.progress?.progress}
        />
      )}
      <Description overview={data.description} />

      {data.infoSectionsCards.length > 0 &&
        data.infoSectionsCards
          .filter((item) => item.show)
          .map((item) => <InfoSectionsCard key={item.id} item={item} />)}

      {data.infoSections
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
      {data.CampaignType === "GOODS" && (
        <InfoSection>
          <InfoBlock
            subtitle={"عدد الوحدات المطلوبة"}
            title={data.numberOfUnits}
          />
          <InfoBlock subtitle={"سعر الوحدة (دج)"} title={data.unitPrice} />
          <InfoBlock
            subtitle={"عدد الوحدات المتبرع بها"}
            title={data.donatedUnits}
          />
        </InfoSection>
      )}
      {data.CampaignType === "MONEY" && (
        <InfoSection>
          {data.campaignStatus !== "ONGOING" && (
            <InfoBlock
              subtitle={"المبلغ المستهدف"}
              title={data.progress.requiredAmount}
            />
          )}
          <InfoBlock
            subtitle={"المبلغ المجموع"}
            title={data.progress.totalAmount}
          />
        </InfoSection>
      )}
   


      <InfoSection>
        <InfoBlock subtitle={"عدد عمليات التبرع"} title={data.donationCount} />
        <InfoBlock
          subtitle={"عدد المستفيدين"}
          title={data.numOfBeneficiaries}
        />
        <InfoBlock subtitle={"عدد الزيارات"} title={data.visits} />
      </InfoSection>
      {data.progress && data.progress.rate < 100 ? (
        <PrimaryBtn
          onPress={() => {
            if (!data.isAgreed)
              return ToastAndroid.show(
                "الحملة معقلة ولا يمكنك التبرع حتى يتم الموافقة عليها من طرف مشرفي المنصة",
                2000
              );
            if (data.rejected)
              return ToastAndroid.show("تم رفض الحملة ولا يمكن التبرع", 2000);
            toggleDonationModal();
            navigation.getParent().setParams({
              typeOfDonation: "donateNow",
              donationData: {
                id: data.id,
                title: data.title,
                image: API_ENDPOINTS.UPLOADS + "/" + data.images[0]?.filename,
                donationType: CONSTANTS.DONATION_TYPES.CAMPAIGN,
                CampaignType: data.CampaignType,
                unitPrice: data.unitPrice,
              },
            });
          }}
          title="تبرع الآن"
        />
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Button
            onPress={() => setModalVisibility(true)}
            bgColor={theme.secondaryColor}
            isActive
            label="عرض التقرير"
            width={"80%"}
          />
        </View>
      )}
      <Image
        source={require("../../../assets/logo/fullLogo.png")}
        style={styles.footerImage}
      />

      <ModelWrapper
        height="82%"
        closeModel={() => setModalVisibility(false)}
        isModelOpen={modalVisibility}
      >
        <RapportModal
          data={{
            name: "تقرير الحملات",
            rapportType: "userCampaignsReport",
            URI: `${API_ENDPOINTS.REPPORTS.GET_CAMPAIGNS_REPPORTS}/${data.id}`,
          }}
        />
      </ModelWrapper>
    </ScreensContainer>
  );
};

const HeaderContainer = ({ theme, data, handlePress }) => {
  // Initialize with a specific past date
  const lastDonation =
    data.donations.length > 0 &&
    data.donations?.reduce((latest, donation) => {
      const latestDate = new Date(latest.createdAt);
      const currentDate = new Date(donation.createdAt);
      return currentDate > latestDate ? donation : latest;
    }, data.donations[0]);

  console.log(lastDonation.createdAt);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconRow}>
        {data.isAgreed ? (
          <Icon.MaterialIcons
            name="check-circle"
            size={24}
            color={theme.successColor}
          />
        ) : (
          <Icon.MaterialIcons
            name="pending"
            size={24}
            color={theme.warningColor}
          />
        )}
        {data.rejected ? (
          <Icon.MaterialIcons name="error" size={24} color={theme.errorColor} />
        ) : null}
      </View>
      <View style={styles.headerTextContainer}>
        <Text type="lg">{data.title}</Text>
        {data.rejected && (
          <Text type="sm" color={theme.errorColor}>
            سبب الرفض: {data.rejectedWhy}
          </Text>
        )}
        <Text type="md" color="#225570">
          {data.id}#
        </Text>
        <Text type="sm" color={theme.steel}>
          {lastDonation
            ? getElapsedTime(lastDonation?.createdAt)
            : "كن انت اول مساههم للحملة"}
        </Text>

        {data.campaignStatus == "ONGOING" && (
          <Text type="md" color={theme.steel}>
            {data.progress?.totalAmount} {process.env.APP_CURRENCY_NAME} المبلغ
            المجموع
          </Text>
        )}
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
      progress={rate}
    />
    <View style={styles.progressTextContainer}>
      <Text type="md">{title}</Text>
      <Text type="md">{rate * 100 + "%"}</Text>
    </View>
  </View>
);

const Description = ({ overview }) => {
  if (overview.length <= 0) return null;
  return (
    <View style={styles.descriptionText}>
      <MyMarkDown>{overview}</MyMarkDown>
    </View>
  );
};
export const InfoSectionsCard = ({ item }) => {
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

export const InfoSection = ({ children, title = null }) => {
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

export const InfoBlock = ({ title, subtitle }) => (
  <View style={styles.infoBlock}>
    <Text type="md">{title}</Text>
    <Text type="xs">{subtitle}</Text>
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

export default MyCampaignDetails;
