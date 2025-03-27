import LabelContainer, { Button } from "../components/ButtonWithLabel";
import CustomDropDown from "../components/CustomDropDown";
import { Slider } from "@miblanchard/react-native-slider";
import { useTheme } from "../context/ThemeContext";
import { ScrollView } from "react-native";
import React, { useEffect } from "react";
import Icon from "../components/Icon";
import { useAlgeriaCitiesContext } from "../context/AlgeriaCitiesContext";

export default function OrphanFilter({ closeModel, setFilterData }) {
  const { wilayas } = useAlgeriaCitiesContext();

  const [wilaya, setWilaya] = React.useState(null);
  const [schoolLevel, setSchoolLevel] = React.useState(null);
  const [healthStatus, setHealthStatus] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [age, setAge] = React.useState(null);
  const { theme } = useTheme();

  const handleSliderChange = (value) => {
    setAge(Math.floor(value));
  };
  const handleWilayaChange = (value) => {
    setWilaya(value);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleSortByChange = (value) => {
    console.log(value);
    setSortBy(value);
  };
  const newfilterData = {
    age,
    wilaya : wilaya?.wilaya_code,
    gender,
    healthStatus,
    schoolLevel,
    sortBy,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingRight: 30,
        gap: 20,
      }}
    >
      <LabelContainer
        label={
          wilaya
            ? `المنطقة (${wilaya.wilaya_code}-${wilaya.wilaya_name})`
            : "المنطقة"
        }
      >
        <CustomDropDown
          handleChanges={handleWilayaChange}
          data={wilayas}
          valueField="wilaya_code"
          value={wilaya ? wilaya?.wilaya_code : null}
          labelField="wilaya_name"
          searchField="wilaya_name"
          icon={
            <Icon.Ionicons name="location" size={20} color={theme.textColor} />
          }
        />
      </LabelContainer>
      <LabelContainer label="الجنس">
        <Button
          onPress={() => setGender("male")}
          isActive={gender === "male"}
          label="ذكر"
          icon={
            <Icon.Ionicons
              name="male"
              size={20}
              color={gender === "male" ? "white" : theme.textColor}
            />
          }
        />
        <Button
          isActive={gender === "female"}
          onPress={() => setGender("female")}
          label="انثى"
          icon={
            <Icon.Ionicons
              name="female"
              size={20}
              color={gender === "female" ? "white" : theme.textColor}
            />
          }
        />
      </LabelContainer>
      <LabelContainer label={age ? `العمر (${age} سنة)` : "العمر"}>
        <Slider
          thumbTintColor={theme.primaryColor}
          containerStyle={{ width: 300, height: 40, alignSelf: "center" }}
          maximumValue={100}
          minimumValue={18}
          value={30}
          onValueChange={handleSliderChange}
        />
      </LabelContainer>
      <LabelContainer label="المرحلة الدراسية">
        <ScrollView
          horizontal
          onLayout={(e) => e.target.scrollToEnd({ animated: false })}
        >
          <Button
            isActive={schoolLevel === "جامعي"}
            onPress={() => setSchoolLevel("جامعي")}
            label="جامعي"
          />
          <Button
            isActive={schoolLevel === "ثانوي"}
            onPress={() => setSchoolLevel("ثانوي")}
            label="ثانوي"
          />
          <Button
            isActive={schoolLevel === "متوسط"}
            onPress={() => setSchoolLevel("متوسط")}
            label="متوسط"
          />
          <Button
            isActive={schoolLevel === "ابتدائي"}
            onPress={() => setSchoolLevel("ابتدائي")}
            label="ابتدائي"
          />
          <Button
            isActive={schoolLevel === "لايردس"}
            onPress={() => setSchoolLevel("لايردس")}
            label="لا يدرس"
          />
        </ScrollView>
      </LabelContainer>

      <LabelContainer label="الحالة الصحية">
        <ScrollView
          horizontal
          onLayout={(e) => e.target.scrollToEnd({ animated: false })}
        >
          <Button
            onPress={() => setHealthStatus("ذوي الاحتياجات الخاصة")}
            isActive={healthStatus === "ذوي الاحتياجات الخاصة"}
            label="ذوي الاحتياجات الخاصة"
          />
          <Button
            onPress={() => setHealthStatus("مرض مزمن حاد")}
            isActive={healthStatus === "مرض مزمن حاد"}
            label="مرض مزمن حاد"
          />
          <Button
            onPress={() => setHealthStatus("مرض مزمن")}
            isActive={healthStatus === "مرض مزمن"}
            label="مرض مزمن "
          />
          <Button
            onPress={() => setHealthStatus("سليم")}
            isActive={healthStatus === "سليم"}
            label="سليم"
          />
        </ScrollView>
      </LabelContainer>
      <LabelContainer label="ترتيب حسب">
        <CustomDropDown
          handleChanges={handleSortByChange}
          data={[
            { label: "الاقدم", value: "old" },
            { label: "الاحدث", value: "new" },
          ]}
          valueField="value"
          value={sortBy}
          labelField="label"
          icon={
            <Icon.FontAwesome5
              name="sort-amount-down"
              size={20}
              color={theme.textColor}
            />
          }
        />
      </LabelContainer>
      <LabelContainer>
        <Button
          onPress={() => {
            closeModel();
            setFilterData(newfilterData);
          }}
          label="موافق"
          isActive={true}
        />
        <Button onPress={closeModel} label="الغاء" isActive={false} />
      </LabelContainer>
    </ScrollView>
  );
}
