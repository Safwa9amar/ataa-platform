import LabelContainer, {Button} from '../components/ButtonWithLabel';
import CustomDropDown from '../components/CustomDropDown';
import {Slider} from '@miblanchard/react-native-slider';
import {useTheme} from '../context/ThemeContext';
import {ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Icon from '../components/Icon';

export default function JudicialEnfFilter({closeModel, setFilterData}) {
  const [maritalStatus, setMaritalStatus] = React.useState(null);
  const [factureDelay, setfactureDelay] = React.useState(null);
  const [casesNum, setCasesNum] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [age, setAge] = React.useState(null);
  const {theme} = useTheme();

  const handleAmountChange = value => {
    setAmount(value);
  };
  const handleSliderChange = value => {
    setfactureDelay(Math.floor(value));
  };

  const handleSliderChangeForAge = value => {
    setAge(Math.floor(value));
  };
  const handleSortByChange = value => {
    setSortBy(value);
  };
  const newfilterData = {
    factureDelay,
    gender,
    maritalStatus,
    casesNum,
    sortBy,
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
      <LabelContainer label={age ? `العمر (${age} سنة)` : 'العمر'}>
        <Slider
          thumbTintColor={theme.primaryColor}
          containerStyle={{width: 300, height: 40, alignSelf: 'center'}}
          maximumValue={100}
          minimumValue={18}
          value={30}
          onValueChange={handleSliderChangeForAge}
        />
      </LabelContainer>

      <LabelContainer label="عدد القضايا">
        <ScrollView
          horizontal
          onLayout={e => e.target.scrollToEnd({animated: false})}>
          <Button
            isActive={casesNum === 100}
            onPress={() => setCasesNum(100)}
            label="اكثر"
          />
          <Button
            label="5"
            isActive={casesNum === 5}
            onPress={() => setCasesNum(5)}
          />
          <Button
            isActive={casesNum === 4}
            onPress={() => setCasesNum(4)}
            label="4"
          />
          <Button
            isActive={casesNum === 3}
            onPress={() => setCasesNum(3)}
            label="3"
          />
          <Button
            isActive={casesNum === 2}
            onPress={() => setCasesNum(2)}
            label="2"
          />
          <Button
            isActive={casesNum === 1}
            onPress={() => setCasesNum(1)}
            label="1"
          />
        </ScrollView>
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
      <LabelContainer
        label={
          factureDelay
            ? `المدة منذ صدور الفاتورة (${factureDelay} شهر)`
            : 'المدة منذ صدور الفاتورة'
        }>
        <Slider
          thumbTintColor={theme.primaryColor}
          containerStyle={{width: 300, height: 40, alignSelf: 'center'}}
          maximumValue={12}
          minimumValue={1}
          value={5}
          onValueChange={handleSliderChange}
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
