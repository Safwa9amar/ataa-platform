import React, {useRef, useEffect, useLayoutEffect} from 'react';
import {FlatList, Image, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import Text from '../../../components/Text';
import {useNavigation} from '@react-navigation/native';

const navigationItems = [
  {
    name: 'احصائيات',
    LightIcon: require('../../../assets/icons/Frame212.png'),
    darkIcon: require('../../../assets/icons/Frame212dark.png'),
    screen: 'GeneralStatistics',
  },
  {
    name: 'الفرص المكتملة',
    LightIcon: require('../../../assets/icons/Frame211.png'),
    darkIcon: require('../../../assets/icons/Frame211dark.png'),
    screen: 'CompletedOpportunities',
  },
  {
    name: 'الجمعيات الخيرية',
    LightIcon: require('../../../assets/icons/Frame210.png'),
    darkIcon: require('../../../assets/icons/Frame210dark.png'),
    screen: 'CharitableSocieties',
  },
  {
    name: 'الجهات الاشرافية',
    LightIcon: require('../../../assets/icons/Frame209.png'),
    darkIcon: require('../../../assets/icons/Frame209dark.png'),
    screen: 'SupervisoryAuthorities',
  },
  {
    name: 'كبار المحسنين',
    LightIcon: require('../../../assets/icons/Frame209.png'),
    darkIcon: require('../../../assets/icons/Frame209dark.png'),
    screen: 'KibarMohsninScreeen',
  },
  {
    name: 'شركاء الاحسان',
    LightIcon: require('../../../assets/icons/Frame207.png'),
    darkIcon: require('../../../assets/icons/Frame207dark.png'),
    screen: 'GivingPartners',
  },
  {
    name: 'سفراء عطاء',
    LightIcon: require('../../../assets/icons/Frame208.png'),
    darkIcon: require('../../../assets/icons/Frame208dark.png'),
    screen: 'AmbassadorsScreen',
  },
];

const NavigationItem = ({name, icon, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Image
      style={{
        height: 80,
        width: 80,
        borderRadius: 100,
      }}
      source={icon}
    />
    <Text type="bodyTextExtraSmall">{name}</Text>
  </TouchableOpacity>
);

const HomeNavigation = () => {
  const {isDarkMode} = useTheme();
  const navigation = useNavigation();

  return (
    <FlatList
      inverted
      data={navigationItems}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <NavigationItem
          name={item.name}
          icon={isDarkMode ? item.darkIcon : item.LightIcon}
          onPress={() => navigation.navigate(item.screen)}
        />
      )}
      horizontal
      contentContainerStyle={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 20,
      }}
    />
  );
};

export default HomeNavigation;
