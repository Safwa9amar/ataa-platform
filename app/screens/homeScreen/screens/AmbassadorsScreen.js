import React, { useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import ScreensContainer from "../../../components/ScreensContainer";
import Text from "../../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import API_ENDPOINTS from "../../../config/config";
import { useState } from "react";
const AmbassadorsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [ambassadors, setAmbassadors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAmbassadors = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS.GET_ALL);
      const data = await response.json();
      setAmbassadors(
        data
          .filter((user) => user.ambassadorRank > 0)
          .sort((a, b) => b.ambassadorRank - a.ambassadorRank)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
    getAmbassadors();
  }, []);

  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getAmbassadors} />
      }
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
          padding: 20,
          position: "absolute",
          right: 0,
          top: -10,
        }}
      >
        <Text
          type="bodyText"
          style={{
            color: "white",
          }}
        >
          سفراء
        </Text>
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require("../../../assets/images/charityday.jpg")}
        />
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Text
            type="headingSmall"
            style={{
              color: theme.secondaryColor,
            }}
          >
            سفراء عطاء
          </Text>
          <Text
            type="headingMedium"
            style={[
              {
                color: theme.white,
              },
              styles.subHeading,
            ]}
          >
            "الدال على الخير كفاعله"
          </Text>
          <Text style={styles.bodyText}>
            كنتم خير معاون، ودليلا للخير عبر برنامج سفراء شكرا على إحسانكم
          </Text>
        </View>
      </View>
      <TableData refreshing={refreshing} data={ambassadors} />
    </ScreensContainer>
  );
};
const TableData = ({ data, refreshing }) => {
  const { theme } = useTheme();
  const styles = {
    container: {
      position: "relative",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.secondaryColor,
      padding: 15,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      position: "sticky",
      top: -50,
      zIndex: 1,
    },
    headerText: {
      color: theme.white,
      textAlign: "center",
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.steel,
      backgroundColor: theme.backgroundColor,
    },
    tableText: {
      color: theme.textColor,
      fontSize: 16,
    },
  };

  const RenderTableItem = ({ item }) => (
    <View style={styles.tableRow}>
      {/* <AntDesign name="user" size={24} color={theme.secondaryColor} /> */}
      <Text style={styles.tableText}>{item.ambassadorRank} نقطة</Text>
      <Text style={styles.tableText}>{item.name}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        {/* <AntDesign name="user" size={24} color="white" /> */}
        <Text type="md" style={styles.headerText}>
          {"نقاط السفير"}
        </Text>
        <Text type="md" style={styles.headerText}>
          {"اسم السفير"}
        </Text>
      </View>
      <ScrollView
        style={{
          position: "sticky",
          top: -50,
          zIndex: 1,
        }}
      >
        {refreshing ? (
          <ActivityIndicator size="large" color={theme.primaryColor} />
        ) : (
          data.map((item, index) => <RenderTableItem item={item} key={index} />)
        )}
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 350,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    height: 350,
    width: "100%",
    position: "absolute",
    zIndex: -2,
  },
  overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.6,
    zIndex: -1,
  },
  contentContainer: {
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },

  subHeading: {
    fontFamily: "NotoNastaliqUrdu-VariableFont_wght",
  },
  bodyText: {
    color: "white",
    textAlign: "center",
  },
});

export default AmbassadorsScreen;
