import LabelContainer, {Button} from '../components/ButtonWithLabel';
import CustomDropDown from '../components/CustomDropDown';
import {Slider} from '@miblanchard/react-native-slider';
import {useTheme} from '../context/ThemeContext';
import {ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Icon from '../components/Icon';

export default function FactureFilter({closeModel, setFilterData}) {
  const [maritalStatus, setMaritalStatus] = React.useState(null);
  const [damageLevel, setDamageLevel] = React.useState(null);
  const [wilaya, setWilaya] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const {theme} = useTheme();

  const handleAmountChange = value => {
    setAmount(value);
  };
  const handleWilayaChange = value => {
    setWilaya(value);
  };

  const handleSortByChange = value => {
    console.log(value);
    setSortBy(value);
  };
  const newfilterData = {
    wilaya,
    sortBy,
    amount,
    gender,
    maritalStatus,
    damageLevel,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingRight: 30,
        gap: 20,
      }}>
      <LabelContainer label="الجنس">
        <Button
          onPress={() => setGender('male')}
          isActive={gender === 'male'}
          label="ذكر"
          icon={
            <Icon.Ionicons
              name="male"
              size={20}
              color={gender === 'male' ? 'white' : theme.textColor}
            />
          }
        />
        <Button
          isActive={gender === 'female'}
          onPress={() => setGender('female')}
          label="انثى"
          icon={
            <Icon.Ionicons
              name="female"
              size={20}
              color={gender === 'female' ? 'white' : theme.textColor}
            />
          }
        />
      </LabelContainer>
      <LabelContainer label="الحالة الاجتماعية">
        <Button
          isActive={maritalStatus === 'maried'}
          onPress={() => setMaritalStatus('maried')}
          label="متزوج"
        />
        <Button
          isActive={maritalStatus === 'single'}
          onPress={() => setMaritalStatus('single')}
          label="اعزب"
        />
      </LabelContainer>

      <LabelContainer label={'المبلغ المتبقي'}>
        <CustomDropDown
          position="top"
          search={false}
          handleChanges={handleAmountChange}
          data={[
            {label: '1000 دج', value: 1000},
            {label: '2000 دج', value: 2000},
            {label: '3000 دج', value: 3000},
            {label: '4000 دج', value: 4000},
            {label: '5000 دج', value: 5000},
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
      <LabelContainer label="الحالة ">
        <Button
          label="منقطعة"
          isActive={damageLevel === 'broken'}
          onPress={() => setDamageLevel('broken')}
        />
        <Button
          label="ستنقطع"
          isActive={damageLevel === 'willBreak'}
          onPress={() => setDamageLevel('willBreak')}
        />
      </LabelContainer>
      <LabelContainer label="ترتيب حسب">
        <CustomDropDown
          handleChanges={handleSortByChange}
          data={[
            {label: 'الاقدم', value: 'old'},
            {label: 'الاحدث', value: 'new'},
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
