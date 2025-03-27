import LabelContainer, {Button} from '../components/ButtonWithLabel';
import CustomDropDown from '../components/CustomDropDown';
import {Slider} from '@miblanchard/react-native-slider';
import {useTheme} from '../context/ThemeContext';
import {ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Icon from '../components/Icon';
import { useAlgeriaCitiesContext } from '../context/AlgeriaCitiesContext';

export default function CaringMosquesFilter({closeModel, setFilterData}) {
  const { wilayas } = useAlgeriaCitiesContext();

  const [wilaya, setWilaya] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [careType, setCareType] = React.useState(null);
  const [damageLevel, setDamageLevel] = React.useState(null);
  const {theme} = useTheme();

  const handleWilayaChange = value => {
    setWilaya(value);
  };

  const handleSortByChange = value => {
    console.log(value);
    setSortBy(value);
  };
  const newfilterData = {
    wilaya : wilaya?.wilaya_code,
    sortBy,
    careType,
    damageLevel,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingRight: 30,
        gap: 20,
      }}>
      <LabelContainer label="العناية المطلوبة">
        <Button
          label="صيانة"
          isActive={careType === 'maintenance'}
          onPress={() => setCareType('maintenance')}
        />
        <Button
          label="عناية"
          isActive={careType === 'care'}
          onPress={() => setCareType('care')}
        />
        <Button
          label="ترميم"
          isActive={careType === 'renovation'}
          onPress={() => setCareType('renovation')}
        />
      </LabelContainer>
      <LabelContainer
        label={
          wilaya ? `المنطقة (${wilaya.wilaya_code}-${wilaya.wilaya_name})` : 'المنطقة'
        }>
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
      <LabelContainer label="درجة التضرر">
        <Button
          label="تقام فيه الصلاة"
          isActive={damageLevel === 'prayer'}
          onPress={() => setDamageLevel('prayer')}
        />
        <Button
          label="لا تقام فيه الصلاة"
          isActive={damageLevel === 'noPrayer'}
          onPress={() => setDamageLevel('noPrayer')}
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
