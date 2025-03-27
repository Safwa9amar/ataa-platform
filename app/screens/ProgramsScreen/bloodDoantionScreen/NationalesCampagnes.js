import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import DonationCardVariants from "../../../components/DonationCardVariants";
import CustomDropDown from "../../../components/CustomDropDown";
import LabelContainer from "../../../components/ButtonWithLabel";
import Icon from "../../../components/Icon";
import { useTheme } from "../../../context/ThemeContext";
import AlertMessage from "../../../components/AlertMessage";
import { useAlgeriaCitiesContext } from "../../../context/AlgeriaCitiesContext";

export default function NationalesCampagnes() {
  const { theme } = useTheme();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { wilayas } = useAlgeriaCitiesContext();

  return (
    <>
      <FlatList
        contentContainerStyle={{
          backgroundColor: theme.backgroundColor,
          flex: 1,
        }}
        data={[1]}
        ListHeaderComponent={() => (
          <LabelContainer width="95%" label="عرض حسب الولاية">
            <CustomDropDown
              handleChanges={(value) => {
                console.log(value);
              }} // TODO : handle changes to filter data by wilaya code and get the data from the server
              data={wilayas}
              valueField="wilaya_code"
              value={"الجزائر"}
              labelField="wilaya_name"
              searchField="wilaya_name"
              icon={
                <Icon.Ionicons
                  name="options"
                  size={20}
                  color={theme.textColor}
                />
              }
            />
          </LabelContainer>
        )}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <DonationCardVariants.NationalBloodDonation
            key={item}
            image={{
              uri: "https://media.licdn.com/dms/image/D5610AQEJqQiJR0_wxA/image-shrink_800/0/1713024083175?e=2147483647&v=beta&t=YFE6KL71Q9RZnmAKIg2-i9ijAedxmGt3dBm-Mr1p4BU",
            }}
            badgeTitle="ساهم في إنقاذ حياة"
            title="حملة التبرع بالدم الوطنية"
            description="تبرع بالدم وانقذ حياة انسان"
            remainingAmount="100"
            onPress={() => {}}
            width={"90%"}
          />
        )}
        ListEmptyComponent={() => {
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
      />
    </>
  );
}
