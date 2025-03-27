import {
  View,
  FlatList,
  StyleSheet,
  Linking,
  RefreshControl,
} from "react-native";
import React, {
  useLayoutEffect,
  useCallback,
  memo,
  useEffect,
  useState,
} from "react";
import { useTheme } from "../../../context/ThemeContext";
import Icon from "../../../components/Icon";
import CustomScreenHeader from "../../../components/CustomScreenHeader";
import ScreensContainer from "../../../components/ScreensContainer";
import TabItem from "../../../components/TabItem";
import Text from "../../../components/Text";
import { getAppointmentByUserId } from "../../../services/appointmentsServices";
import { useCredentials } from "../../../context/CredentialsContext";
import dayjs from "dayjs";
import { CONSTANTS } from "../../../config/config";
import ContactDivider from "../../../components/ContactDivider";

export default function MyAppointments({ navigation }) {
  const { user, userToken } = useCredentials();
  const { isDarkMode, theme } = useTheme();
  const [activeTab, setActiveTab] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // For refresh control

  // Appointments types data
  const appointmentsTypes = [
    {
      status: "all",
      ar_status: "الكل",
      color: "black",
      icon: (active) => (
        <Icon.Entypo
          name="list"
          size={18}
          color={active ? "white" : theme.textColor}
        />
      ),
    },
    {
      status: CONSTANTS.CAMPAIGN_USER_CREATETOR_TYPES.USERCAMPAIGN,
      ar_status: "حملة مستخدم",
      color: "red",
      icon: (active) => (
        <Icon.AntDesign
          name="user"
          size={18}
          color={active ? "white" : theme.textColor}
        />
      ),
    },
    {
      status: CONSTANTS.CAMPAIGN_USER_CREATETOR_TYPES.NATIONALCAMPAIGN,
      ar_status: "حملة وطنية",
      color: "blue",
      icon: (active) => (
        <Icon.FontAwesome
          name="group"
          size={18}
          color={active ? "white" : theme.textColor}
        />
      ),
    },
  ];

  useLayoutEffect(() => {
    navigation.getParent().setOptions({ headerShown: false });
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader navigation={navigation} label="مواعيدي" />
      ),
    });
  }, [navigation, isDarkMode]);

  // Fetch appointments data
  const getData = async () => {
    const appointmentsData = await getAppointmentByUserId(user.id, userToken);
    setAppointments(appointmentsData);
  };

  // Refresh appointments data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const renderTabItem = useCallback(
    ({ item }) => (
      <TabItem
        icon={item.icon(activeTab === item.status)}
        bg={activeTab === item.status ? item.color : null}
        isActive={activeTab === item.status}
        label={item.ar_status}
        onPress={() => setActiveTab(item.status)}
      />
    ),
    [activeTab]
  );

  // Filter appointments based on the active tab
  const filteredAppointments = appointments.filter((appointment) =>
    activeTab === "all" ? true : appointment.type === activeTab
  );

  const header = useCallback(
    () => (
      <FlatList
        data={appointmentsTypes}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        inverted
        contentContainerStyle={styles.tabListContainer}
        renderItem={renderTabItem}
        extraData={activeTab}
      />
    ),
    [activeTab]
  );

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={header}
      data={filteredAppointments}
      renderItem={({ item }) => <MemoizedCampaignCard item={item} />}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

export const AppointmentCampaignCard = ({ item }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.campaignCardContainer(theme.mangoBlack)}>
      <Text type="lg">{item.campaign?.title}</Text>
      <Text type="sm">
        حالة الحملة : {CONSTANTS.CAMPAIGNSTATUS[item.campaign?.campaignStatus]}
      </Text>
      <Text type="sm">
        تاريخ وتوقيت حجز الموعد :{" "}
        {dayjs(item.createdAt).format("A HH:mm - DD/MM/YYYY ")}
      </Text>
      <Text type="sm">
        تاريخ موعد التبرع :{" "}
        {item.date
          ? dayjs(item.date).format("DD/MM/YYYY")
          : "لم يتم تحديد موعد"}
      </Text>
      <Text type="sm">
        توقيت موعد تبرع {item.date ? dayjs(item.date).format("HH:mm A") : "/"}
      </Text>
      <ContactDivider />

      <View style={styles.cardActions}>
        <TabItem
          onPress={() => Linking.openURL(item.campaign?.googleMapLink)}
          label={
            item.campaign?.googleMapLink ? "فتح الخريطة" : "الخريطة غير متوفرة"
          }
          icon={
            <Icon.FontAwesome6
              name="map-location-dot"
              size={18}
              color={theme.textColor}
            />
          }
          accessibilityLabel="Open donation service"
        />
        <TabItem
          label={item.isDone ? "تم التبرع" : "لم يتم التبرع"}
          icon={
            <Icon.MaterialIcons
              name={item.isDone ? "check" : "pending"}
              size={18}
              color={theme.textColor}
            />
          }
          accessibilityLabel="Confirm donation"
        />
      </View>
    </View>
  );
};

const MemoizedCampaignCard = memo(AppointmentCampaignCard);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 50,
  },
  tabListContainer: {
    padding: 10,
  },
  campaignCardContainer: (bg) => ({
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: bg,
    alignItems: "flex-end",
    gap: 8,
  }),
  cardActions: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
});
