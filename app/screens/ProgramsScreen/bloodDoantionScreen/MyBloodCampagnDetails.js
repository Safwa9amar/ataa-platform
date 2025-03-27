import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { useHideNavbar } from "../../../context/NavbarVisibilityContext";
import { useTheme } from "../../../context/ThemeContext";
import { useAppContext } from "../../../context/AppContext";
import ScreensContainer from "../../../components/ScreensContainer";
import Text from "../../../components/Text";
import Icon from "../../../components/Icon";
import * as Progress from "react-native-progress";
import Carousel from "react-native-snap-carousel";
import PrimaryBtn from "../../../components/PrimaryBtn";
import ModelWrapper from "../../../components/ModelWrapper";
import LabelContainer from "../../../components/ButtonWithLabel";
import { InputWithFloatingLabel } from "../../../components/InputWithFloatingLabel";
import ContactDivider from "../../../components/ContactDivider";
import { getCampaignById } from "../../../services/campaignServices";
import DefaultSkeletonLoader from "../../../components/skeleton/DefaultSkeletonLoader";
import { useCredentials } from "../../../context/CredentialsContext";
import API_ENDPOINTS from "../../../config/config";
import getElapsedTime from "../../../utils/getElpasedTime";
import MyMarkDown from "../../../components/MyMarkdown";
import { Platform } from "react-native";
import { ActivityIndicator } from "react-native";
import AlertMessage from "../../../components/AlertMessage";
import validator from "validator";
import SecondaryBtn from "../../../components/SecondaryBtn";
import TabItem from "../../../components/TabItem";
import { Row, Rows, Table } from "react-native-reanimated-table";
import {
  createAppointment,
  updateAppointment,
} from "../../../services/appointmentsServices";
import DatePicker from "react-native-date-picker";
const BLOOD_TYPES = [
  {
    name: "A+",
    code: "A_POSITIVE",
  },

  {
    name: "A-",
    code: "A_NEGATIVE",
  },
  {
    name: "B+",
    code: "B_POSITIVE",
  },
  {
    name: "B-",
    code: "B_NEGATIVE",
  },
  {
    name: "O+",
    code: "O_POSITIVE",
  },
  {
    name: "O-",
    code: "O_NEGATIVE",
  },
  {
    name: "AB+",
    code: "AB_POSITIVE",
  },
  {
    name: "AB-",
    code: "AB_NEGATIVE",
  },
];

const MyBloodCampagnDetails = ({ navigation, route }) => {
  const campaignId = route.params?.campaignId;
  const { setHideNavbar } = useHideNavbar();
  const { user } = useCredentials();
  const { theme } = useTheme();
  const { carouselLayout } = useAppContext();
  const dimensions = Dimensions.get("screen");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useCredentials();

  const [donorInfo, setDonorInfo] = useState({
    email: "",
    phone: "",
  });
  const [booking, setBooking] = useState();
  const [alert, setAlert] = useState({
    msg: null,
    type: "",
    show: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);

  const closeModal = () => {
    getDetails();
    setShowModal(false);
  };
  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({ headerShown: false });
    return () => setHideNavbar(false);
  }, [navigation, setHideNavbar]);

  const getDetails = async () => {
    setLoading(true);
    try {
      const data = await getCampaignById(campaignId, userToken);
      setData(data);
    } catch (error) {
      console.error("Error fetching campaign details:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDetails();
  }, [campaignId]);

  const bookAppointment = async () => {
    // check if donor enter data
    if (validator.isEmpty(donorInfo.email)) {
      setAlert({
        msg: "الرجاء ادخال بريد الكتروني للحجز",
        type: "warning",
        show: true,
      });
      return;
    }

    if (validator.isEmpty(donorInfo.phone)) {
      setAlert({
        msg: "الرجاء ادخال رقم هاتف للحجز",
        type: "warning",
        show: true,
      });
      return;
    }

    setBooking(true);
    try {
      let res = await createAppointment(
        {
          email: donorInfo.email,
          phone: donorInfo.phone,
          campaignId,
          locationLink: "",
          userId: user.id,
          type: "USERCAMPAIGN",
        },
        userToken
      );
      if (res) {
        setBooking(false);
        setAlert({
          msg: "تم حجز موعدك بنجاح",
          type: "success",
          show: true,
        });
        setDonorInfo({
          email: "",
          phone: "",
        });
        setTimeout(() => {
          setAlert({
            msg: null,
            type: "",
            show: false,
          });
          setShowModal(false);
          getDetails();
        }, 2000);
      }
    } catch {
      setBooking(false);
      setAlert({
        msg: "حدث خطأ اثناء حجز موعدك",
        type: "error",
        show: true,
      });
    }
  };

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
          />
        )}

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
      <HeaderContainer theme={theme} data={data} />
      <ProgressBar
        dimensions={dimensions}
        theme={theme}
        rate={data.progress?.rate / 100}
        title={
          "الوحدات المتبرع بها: " + data.donatedUnits + "/" + data.numberOfUnits
        }
        progress={data.progress.rate + "%"}
      />
      <Description description={data.description} />
      {data?.InfoSectionsCards?.map((item) => (
        <InfoSectionsCard key={item.id} item={item} />
      ))}
      {data?.InfoSections?.map((section) => (
        <InfoSection key={section.id} title={section.title}>
          {section.infoBlocks.map((block) => (
            <InfoBlock
              key={block.id}
              title={block.subtitle.toString()}
              subtitle={block.title}
            />
          ))}
        </InfoSection>
      ))}

      <InfoSection>
        <InfoBlock
          subtitle={"عدد الوحدات المطلوبة"}
          title={data.numberOfUnits}
        />
        <InfoBlock
          subtitle={"عدد الوحدات المتبرع بها"}
          title={data.donatedUnits}
        />
      </InfoSection>
      <InfoSection>
        <InfoBlock subtitle={"عدد عمليات التبرع"} title={data.donationCount} />
        <InfoBlock
          subtitle={"عدد المستفيدين"}
          title={data.numOfBeneficiaries}
        />
        <InfoBlock subtitle={"عدد الزيارات"} title={data.visits} />
      </InfoSection>

      <PrimaryBtn
        width="100%"
        onPress={() => {
          setShowAppointments(false);
          if (!data.isAgreed)
            return ToastAndroid.show(
              "الحملة معقلة ولا يمكنك التبرع حتى يتم الموافقة عليها من طرف مشرفي المنصة",
              2000
            );
          if (data.rejected)
            return ToastAndroid.show("تم رفض الحملة ولا يمكن التبرع", 2000);
          data.progress.rate === 100
            ? navigation.navigate("CompletedCampagnBloodRapport")
            : setShowModal(true);
        }}
        title={data.progress.rate === 100 ? "عرض التقرير" : "حجز موعد"}
      />
      {data.user.id === user.id && (
        <SecondaryBtn
          width="100%"
          onPress={() => {
            setShowAppointments(true);
            data.progress.rate === 100
              ? navigation.navigate("CompletedCampaignBloodDonation")
              : setShowModal(true);
          }}
          title={"عرض المواعيد المحجوزة"}
        />
      )}
      <Image
        source={require("../../../assets/logo/fullLogo.png")}
        style={styles.footerImage}
      />
      <ModelWrapper
        height={showAppointments ? "90%" : "60%"}
        closeModel={closeModal}
        isModelOpen={showModal}
      >
        {showAppointments ? (
          <AppointmentList data={data.appointments} />
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={230}
            behavior="position"
          >
            {
              // TODO : add all logic for blood donaion reservation for users
            }
            <Image
              source={require("../../../assets/images/redervos.png")}
              style={{ width: "100%", height: 200 }}
            />
            <InputWithFloatingLabel
              type="email"
              icon={
                <Icon.AntDesign name="mail" size={24} color={theme.textColor} />
              }
              label={"البريد الاكتروني"}
              onChangeText={(text) =>
                setDonorInfo({
                  ...donorInfo,
                  email: text,
                })
              }
            />
            <ContactDivider label={"او عبر"} />
            <InputWithFloatingLabel
              type="phone"
              keyboardType="numeric"
              icon={
                <Icon.AntDesign name="mail" size={24} color={theme.textColor} />
              }
              label={"رقم الهاتف"}
              onChangeText={(text) => {
                setDonorInfo({
                  ...donorInfo,
                  phone: text,
                });
              }}
            />
            {booking ? (
              <ActivityIndicator
                animating={booking}
                size="large"
                color={theme.primaryColor}
              />
            ) : (
              alert.show && (
                <AlertMessage message={alert.msg} type={alert.type} />
              )
            )}
            <PrimaryBtn onPress={bookAppointment} title={"حجز"} />
          </KeyboardAvoidingView>
        )}
      </ModelWrapper>
    </ScreensContainer>
  );
};

const HeaderContainer = ({ theme, data }) => {
  let Appointments = data.appointments.filter((item) => item.isDone);

  // Initialize with a specific past date
  const lastDonation =
    Appointments.length > 0 &&
    Appointments.filter((item) => item.isDone)?.reduce((latest, donation) => {
      const latestDate = new Date(latest.updatedAt);
      const currentDate = new Date(donation.updatedAt);
      return currentDate > latestDate ? donation : latest;
    }, data.appointments[0]);
  return (
    <View style={styles.headerContainer}>
      <ImageBackground
        style={{ height: 70, width: 70 }}
        source={require("../../../assets/images/bloodTypeHolder.png")}
      >
        <Text
          style={{
            paddingBottom: 5,
            fontWeight: "bold",
            position: "absolute",
            top: 10,
            left: 18,
          }}
        >
          {
            BLOOD_TYPES.find((type) => type.code === data.selectedBloodType)
              .name
          }
        </Text>
      </ImageBackground>
      <View style={styles.headerTextContainer}>
        <Text type="lg">
          {data.title}
          {data.rejected ? (
            <Icon.MaterialIcons
              name="error"
              size={24}
              color={theme.errorColor}
            />
          ) : data.isAgreed ? (
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
        </Text>
        <Text type="md" color="#225570">
          {data.id}#
        </Text>
        <Text type="sm" color={theme.steel}>
          {lastDonation
            ? getElapsedTime(lastDonation?.updatedAt)
            : "كن انت اول مساههم للحملة"}
        </Text>
      </View>
    </View>
  );
};

const ProgressBar = ({ dimensions, title, color, progress, rate }) => (
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
      <Text type="md">{progress}</Text>
      <Text type="sm">{title}</Text>
    </View>
  </View>
);

const Description = ({ description }) => {
  if (description.length <= 0) return null;
  return (
    <View style={styles.descriptionText}>
      <MyMarkDown>{description}</MyMarkDown>
    </View>
  );
};
const InfoSectionsCard = ({ item }) => {
  const { theme } = useTheme();

  const renderKeyValuePairs = () => {
    return Object.entries(item).map(([key, value]) => {
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

const AppointmentList = ({ data }) => {
  const [state, setState] = useState(data);
  const { userToken } = useCredentials();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingID, setLoadingID] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleIsDone = async (item) => {
    if (loading || item.isDone) return;
    try {
      setLoading(true);
      setLoadingID(item.id);
      const res = await updateAppointment(
        item.id,
        { isDone: !item.isDone },
        userToken
      );
      // update the data state
      const updatedData = state.map((_item) => {
        if (_item.id === item.id) {
          return { ..._item, isDone: !item.isDone };
        }
        return _item;
      });
      setState(updatedData);
    } catch (error) {
      console.error("Error updating appointment:", error.message);
    } finally {
      setLoading(false);
      setLoadingID(null);
    }
  };
  let handleDateChange = useCallback(
    async (id, date) => {
      if (loading) return;
      try {
        setLoading(true);
        await updateAppointment(id, { date: date }, userToken);
        // console.log("Updated date:", date);
        // Update the state with the new date
        const updatedData = state.map((item) => {
          if (item.id === id) {
            return { ...item, date: date }; // Update the item's date
          }
          return item;
        });
        setState(updatedData); // Update the whole state with the new date
      } catch (error) {
        console.error("Error updating appointment:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [date, state, userToken, loading]
  );

  return (
    <FlatList
      data={state}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 20,
            marginVertical: 10,
            borderRadius: 10,
            backgroundColor: theme.backgroundColor,
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <Text type="md">البريد الالكتروني : {item.email}</Text>
          <Text type="md">رقم الهاتف : {item.phone}</Text>

          <TabItem
            label={!item.isDone ? "تأكيد اكتمال التبرع" : "تم التبرع"}
            isActive={item.isDone}
            icon={
              loadingID === item.id ? (
                <ActivityIndicator
                  animating={loading}
                  key={item.id}
                  size="small"
                  color={theme.textColor}
                />
              ) : (
                <Icon.MaterialIcons
                  name={item.isDone ? "check" : "pending"}
                  size={18}
                  color={theme.textColor}
                />
              )
            }
            onPress={() => handleIsDone(item)}
          />
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <TabItem
              onPress={() =>
                setOpen({
                  open: true,
                  id: item.id,
                })
              }
              icon={
                <Icon.AntDesign
                  color={theme.textColor}
                  name="calendar"
                  size={20}
                />
              }
            />
            <TabItem
              onPress={() => Linking.openURL(`mailto:${item.email}`)}
              icon={
                <Icon.AntDesign color={theme.textColor} name="mail" size={20} />
              }
            />

            <TabItem
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
              icon={
                <Icon.Ionicons
                  color={theme.textColor}
                  name="call-outline"
                  size={20}
                />
              }
            />
          </View>
        </View>
      )}
      ListFooterComponent={
        <DatePicker
          modal
          open={open.open}
          date={date}
          mode="datetime"
          onConfirm={(date) => {
            setDate(date);
            handleDateChange(open.id, date);
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
  },
  tableBorder: (borderColor) => ({
    borderColor: borderColor,
    borderWidth: 2,
  }),
  head: (secondaryColor) => ({
    height: 50,
    backgroundColor: secondaryColor,
    flexDirection: "row-reverse",
    borderRadius: 10,
  }),
  text: (color) => ({
    margin: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: color,
  }),
  imageContainer: {
    gap: 20,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 20,
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
    justifyContent: "flex-end",
    margin: 10,
  },
  iconRow: {
    flexDirection: "row",
    gap: 10,
  },
  headerTextContainer: {
    width: "85%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    width: Dimensions.get("screen").width - 40,
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

export default MyBloodCampagnDetails;
