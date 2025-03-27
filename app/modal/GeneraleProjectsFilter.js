import LabelContainer, { Button } from "../components/ButtonWithLabel";
import CustomDropDown from "../components/CustomDropDown";
import { Slider } from "@miblanchard/react-native-slider";
import { useTheme } from "../context/ThemeContext";
import { ScrollView } from "react-native";
import React, { useEffect } from "react";
import Icon from "../components/Icon";
import { useAlgeriaCitiesContext } from "../context/AlgeriaCitiesContext";

export default function GeneraleProjectsFilter({ closeModel, setFilterData }) {
  const { wilayas } = useAlgeriaCitiesContext();
  const [wilaya, setWilaya] = React.useState(null);
  const [maritalStatus, setMaritalStatus] = React.useState(null);
  const [disability, setDisability] = React.useState(null);
  const [children, setChildren] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
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
    maritalStatus,
    children,
    amount,
    disability,
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
            ? `الولاية (${wilaya.wilaya_code}-${wilaya.wilaya_name})`
            : "الولاية"
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
      <LabelContainer label="الحالة الاجتماعية">
        <Button
          isActive={maritalStatus === "maried"}
          onPress={() => setMaritalStatus("maried")}
          label="متزوج"
        />
        <Button
          isActive={maritalStatus === "single"}
          onPress={() => setMaritalStatus("single")}
          label="اعزب"
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
      <LabelContainer label="عدد الابناء">
        <ScrollView
          horizontal
          onLayout={(e) => e.target.scrollToEnd({ animated: false })}
        >
          <Button
            isActive={children === 100}
            onPress={() => setChildren(100)}
            label="اكثر"
          />
          <Button
            label="5"
            isActive={children === 5}
            onPress={() => setChildren(5)}
          />
          <Button
            isActive={children === 4}
            onPress={() => setChildren(4)}
            label="4"
          />
          <Button
            isActive={children === 3}
            onPress={() => setChildren(3)}
            label="3"
          />
          <Button
            isActive={children === 2}
            onPress={() => setChildren(2)}
            label="2"
          />
          <Button
            isActive={children === 1}
            onPress={() => setChildren(1)}
            label="1"
          />
          <Button
            isActive={children === 0}
            onPress={() => setChildren(0)}
            label="0"
          />
        </ScrollView>
      </LabelContainer>
      <LabelContainer label={"المبلغ المتبقي"}>
        <CustomDropDown
          position="top"
          search={false}
          handleChanges={handleAmountChange}
          data={[
            { label: "1000 دج", value: 1000 },
            { label: "2000 دج", value: 2000 },
            { label: "3000 دج", value: 3000 },
            { label: "4000 دج", value: 4000 },
            { label: "5000 دج", value: 5000 },
          ]}
          valueField="value"
          value={amount}
          labelField="label"
          icon={
            <Icon.FontAwesome5
              name="money-bill-wave"
              size={20}
              color={theme.textColor}
            />
          }
        />
      </LabelContainer>
      <LabelContainer label="مخصص لذوي الاعاقة">
        <Button
          onPress={() => setDisability(true)}
          isActive={disability}
          label="نعم"
        />
        <Button
          onPress={() => setDisability(false)}
          isActive={!disability}
          label="لا"
        />
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
