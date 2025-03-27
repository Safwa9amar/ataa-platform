import { InputWithFloatingLabel } from "../../../components/InputWithFloatingLabel";
import ScreensContainer from "../../../components/ScreensContainer";
import blooodDonationImg from "../../../assets/images/image47.png";
import LabelContainer from "../../../components/ButtonWithLabel";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { useTheme } from "../../../context/ThemeContext";
import Text from "../../../components/Text";
import Icon from "../../../components/Icon";
import { ScrollView } from "react-native";
import React, { useEffect } from "react";
import AlertMessage from "../../../components/AlertMessage";
import { useCredentials } from "../../../context/CredentialsContext";
import { createAppointment } from "../../../services/appointmentsServices";

export default function BloodDonationBooking({ navigation, route }) {
  const campaignId = route.params?.BloodDonationBooking;
  const { user } = useCredentials();
  const bloodNames = [
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
  const [selectedBloodType, setSelectedBloodType] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [age, setAge] = React.useState(30);
  const scrollViewRef = React.useRef();
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSliderChange = (value) => {
    setAge(Math.floor(value));
  };
  const handleBloodTypeSelect = (name) => {
    console.log(name);

    setSelectedBloodType(name);
  };
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
  };
  const bookingData = {
    email,
    phone,
    age,
    bloodType: selectedBloodType,
    locationLink: "https://www.google.com/maps/place/36.7525,3.042",
    campaignId,
    userId: user.id,
    bloodType: selectedBloodType,
    type: "NATIONALCAMPAIGN",
  };

  const handleBooking = async () => {
    if (!email || !phone || !selectedBloodType) {
      setAlert({
        msg: "الرجاء ملئ جميع الحقول",
        type: "error",
      });
      return;
    }
    setAlert(null);
    setLoading(true);
    try {
      let res = await createAppointment(bookingData);
      if (res) {
        setLoading(false);
        setAlert({
          msg: "تم حجز موعدك بنجاح",
          type: "success",
          show: true,
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setAlert({
        msg: "حدث خطأ اثناء حجز موعدك",
        type: "error",
        show: true,
      });
    }
  };
  return (
    <ScreensContainer>
      <TouchableOpacity
        onPress={handleGoBack}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}
      >
        <Icon.Ionicons
          name="chevron-back-circle-outline"
          size={30}
          color="#000"
        />
      </TouchableOpacity>
      <Image
        source={blooodDonationImg}
        style={{ width: "100%", height: 225, borderRadius: 10 }}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          alignSelf: "center",
          gap: 20,
        }}
      >
        <InputWithFloatingLabel
          onChangeText={handleEmailChange}
          icon={<Icon.Ionicons name="mail" size={20} color={theme.textColor} />}
          label="البريد الالكتروني"
          type="email"
        />
        <InputWithFloatingLabel
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          icon={<Icon.Ionicons name="call" size={20} color={theme.textColor} />}
          label="رقم الهاتف"
          type="phone"
        />
        <LabelContainer label={age ? `العمر (${age} سنة)` : "العمر"}>
          <Slider
            thumbTintColor={"#B80202"}
            containerStyle={{ width: 300, height: 40, alignSelf: "center" }}
            maximumValue={100}
            minimumValue={18}
            value={30}
            onValueChange={handleSliderChange}
          />
        </LabelContainer>
        <LabelContainer label="فصيلة الدم">
          <ScrollView
            horizontal
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }}
            contentContainerStyle={{
              padding: 10,
              gap: 10,
              flexDirection: "row-reverse",
            }}
          >
            {bloodNames.map((item) => (
              <BloodType
                key={item.code}
                selected={selectedBloodType}
                onPress={() => handleBloodTypeSelect(item.code)}
                name={item.name}
                code={item.code}
              />
            ))}
          </ScrollView>
        </LabelContainer>
      </View>
      {loading && (
        <ActivityIndicator animating={loading} size="large" color="#B80202" />
      )}
      {alert && <AlertMessage message={alert.msg} type={alert.type} />}
      <TouchableOpacity
        onPress={handleBooking}
        style={{
          backgroundColor: "#B80202",
          padding: 10,
          borderRadius: 25,
          width: "80%",
          alignSelf: "center",
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
          }}
          type="md"
        >
          طلب الموعد
        </Text>
      </TouchableOpacity>
    </ScreensContainer>
  );
}

export const BloodType = ({ name, code, selected, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => onPress(name)}
      style={{
        backgroundColor: selected === code ? "#B80202" : theme.mangoBlack,
        width: 50,
        height: 50,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: selected === code ? "#fff" : theme.textColor }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};
