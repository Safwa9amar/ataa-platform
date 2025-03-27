import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import DonationCardVariants from "../../components/DonationCardVariants";
import { useTheme } from "../../context/ThemeContext";
import RoundedIconGradientButton from "../../components/RoundedIconGradientButton";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import { getStoreDonationOpportunities } from "../../services/donationOpportunityService";
import { useCredentials } from "../../context/CredentialsContext";
import Text from "../../components/Text";

const StoreDonationOpportunities = ({ navigation }) => {
  const { toggleNavbarOnScroll } = useHideNavbar();
  const [data, setData] = useState([]);
  const { userToken } = useCredentials();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      let data = await getStoreDonationOpportunities(userToken);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getData} />
      }
      ListHeaderComponent={
        <RoundedIconGradientButton
          text="الانتقال إلى متجر التبرع"
          iconName="shopping-cart"
          iconColor="white"
          onPress={() => navigation.navigate("Shop")}
          gradientColors={["#22C6CB", "#01E441"]}
          gradientStart={{ x: 0, y: 0 }}
          gradientEnd={{ x: 1, y: 0 }}
          style={styles.headerButtonStyle}
        />
      }
      onScrollEndDrag={toggleNavbarOnScroll}
      data={data}
      renderItem={({ item }) => (
        <DonationCardVariants.StoreDonationCard
          title={item.title}
          description={item.description}
          image={item.cardImage}
          badgeTitle={item.field.ar_title}
          badgeColor={item.field.color}
          remainingAmount={
            item.progress.requiredAmount - item.progress.totalAmount
          }
          onPress={() =>
            navigation.navigate("DoantionCardDetaills", {
              DonationOpportunitieID: item.id,
            })
          }
          progress={item.progress}
        />
      )}
      ListEmptyComponent={() => (
        <>
          {loading ? (
            <>
              <DonationCardVariants.StoreDonationCard isLoading />
              <DonationCardVariants.StoreDonationCard isLoading />
            </>
          ) : (
            <View
              style={{
                flex: 1,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{ width: 250, height: 200, marginBottom: 10 }}
                source={require("../../assets/images/nodata.png")}
              />
              <Text type="sm">لا توجد فرص لعرضها</Text>
            </View>
          )}
        </>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  headerButtonStyle: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
});

export default StoreDonationOpportunities;
