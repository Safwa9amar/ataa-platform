import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  View,
} from "react-native";
import ScreensContainer from "../../../components/ScreensContainer";
import Text from "../../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import API_ENDPOINTS from "../../../config/config";

const SupervisoryAuthorities = () => {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const { theme } = useTheme();

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        API_ENDPOINTS.SUPERVISORYAUTHORITIES.GET_ALL
      );
      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let listHeader = (
    <>
      <Image
        style={styles.mainImage}
        source={require("../../../assets/logo/logoBg.png")}
      />
      <Text
        style={{
          ...styles.overlayDescription,
          color: theme.steel,
        }}
        type="bodyTextSmall"
      >
        للخير وسائل متعددة، وأبواب الإحسان كثيرة. لهذا السبب، تقدم العديد من
        المؤسسات مبادرات وخدمات لمنصة عطاء
      </Text>
    </>
  );

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getData} />
      }
      contentContainerStyle={styles.listContainer}
      data={data}
      numColumns={2}
      ListHeaderComponent={listHeader}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 10 }}>
          <RenderPartnerCard
            key={item.id}
            partnerName={item.name}
            partnerImage={{ uri: item.logo }}
          />
        </View>
      )}
    />
  );
};

export const RenderPartnerCard = ({ partnerName, partnerImage }) => {
  const { theme } = useTheme();
  return (
    <ImageBackground
      resizeMode="stretch"
      progressiveRenderingEnabled
      source={partnerImage}
      style={styles.partnerCardContent}
      borderRadius={20}
    >
      <View style={styles.overlay}>
        <Text type="sm" color={theme.white} style={styles.partnerCardText}>
          {partnerName}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = {
  listContainer: {
    padding: 10,
    gap: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  partnerCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
    zIndex: 99,
    top: -120,
    padding: 20,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
  },
  partnerCardContent: {
    height: 150,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "center",
  },
  partnerCardText: {
    marginBottom: 30,
    marginRight: 10,
  },

  overlay: {
    backgroundColor: "#00000099",
    width: "100%",
    position: "absolute",
    alignItems: "flex-end",
    borderRadius: 10,
  },
  mainContainer: {
    height: 355,
  },
  mainImage: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
  },
  overlayContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 99,
    backgroundColor: "#000000BF",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
  overlayText: {},
  overlayDescription: {},
};

export default SupervisoryAuthorities;
