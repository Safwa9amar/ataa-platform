import React, {useEffect} from 'react';
import {View, Image, Touchable, TouchableOpacity} from 'react-native';
// import { AntDesign } from "@expo/vector-icons";

import {useTheme} from '../../../context/ThemeContext';
import Text from '../../../components/Text';
import ScreensContainer from '../../../components/ScreensContainer';
import EducationSvg from '../../../assets/vectors/EducationSvg';

import SocialSvg from '../../../assets/vectors/SocialSvg';
import HealthSvg from '../../../assets/vectors/HealthSvg';
import FoodSvg from '../../../assets/vectors/FoodSvg';
import AccommodationSvg from '../../../assets/vectors/AccommodationSvg';
import ReligiousSvg from '../../../assets/vectors/ReligiousSvg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function GeneralStatistics({navigation, route}) {
  const {isDarkMode, theme} = useTheme();
  const {isComingFromAtaaInNumbers} = route.params || {};
  useEffect(() => {
    isComingFromAtaaInNumbers &&
      navigation.setOptions({
        headerTitle: '',
        headerLeft: () => <></>,
        headerStyle: {
          backgroundColor: theme.navBg,
          shadowColor: 'transparent',
        },
        // set header to right
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 100,
              marginRight: 10,
            }}>
            <Text type="bodyTextSmall">احصائيات</Text>
            <AntDesign name="arrowright" size={24} color={theme.textColor} />
          </TouchableOpacity>
        ),
        headerShown: true,
      });
  }, []);
  const data = [
    {
      image: require('../../../assets/images/education.png'),
      icon: <EducationSvg />,
      title: 'تعليم',
      value: '300',
      rating: 20,
    },
    {
      image: require('../../../assets/images/social.png'),
      icon: <SocialSvg />,
      title: 'اجتماعي',
      value: '100',
      rating: 10,
      color: '#6D00F7',
    },
    {
      image: require('../../../assets/images/health.png'),
      icon: <HealthSvg />,
      title: 'صحي',
      value: '100',
      rating: 13,
      color: '#0FA755',
    },
    {
      image: require('../../../assets/images/food.png'),
      icon: <FoodSvg />,
      title: 'عذائي',
      value: '100',
      rating: 18,
      color: '#EB8308',
    },
    {
      image: require('../../../assets/images/iskan.png'),
      icon: <AccommodationSvg />,
      title: 'الاسكان',
      value: '100',
      rating: 25,
      color: '#D908EB',
    },
    {
      image: require('../../../assets/images/religion.png'),
      icon: <ReligiousSvg />,
      title: 'ديني',
      value: '100',
      rating: 32,
      color: '#EB0867',
    },
  ];
  useEffect(() => {}, [isDarkMode]);
  return (
    <ScreensContainer
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          borderBottomColor: theme.steel,
          borderBottomWidth: 1,
        }}>
        <Text>500 تبرع</Text>
        <Text>عمليات التبرع</Text>
      </View> */}
      {/* 
      <Image
        style={{ width: "90%", height: 150 }}
        source={require("../../../assets/forDeletion/NBcharts-lineChats.png")}
      /> */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
        }}>
        <Text type='md'>600 مستفيد</Text>
        <Text type='md'>مجالات التبرع</Text>
      </View>

      {data.map((item, index) => (
        <StatisticCard
          key={index}
          image={item.image}
          icon={item.icon}
          title={item.title}
          value={item.value}
          rating={item.rating}
          color={item.color}
        />
      ))}
    </ScreensContainer>
  );
}

const StatisticCard = function ({
  title,
  value,
  icon,
  color = 'red',
  image,
  rating = 20,
}) {
  const {theme} = useTheme();

  return (
    <View
      style={{
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor : theme.borderColor,
        backgroundColor: theme.mangoBlack,
        borderRadius: 10,
        margin: 10,
        // shado back with 25 opacity
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <View />
      <View
        style={{
          width: 110,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            borderRadius: 10,
            height: 95,
            width: 100,
          }}
          source={image}
        />
        <View
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CircularProgress
            value={rating}
            radius={30}
            duration={1000}
            activeStrokeColor={color}
            activeStrokeWidth={4}
            valueSuffix={'%'}
            titleColor={color}
            titleStyle={{fontWeight: 'bold'}}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'column',
          gap: 5,
          alignItems: 'flex-end',
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}>
          <Text
            type='md'
            style={{
              color: color,
            }}>
            {title}
          </Text>
          {icon || <View />}
        </View>
        <View
          style={{
            paddingRight: 40,
          }}>
          <Text type="sm">عدد المستفيدن</Text>
          <Text type="sm">{value} مستفيد</Text>
        </View>
      </View>
    </View>
  );
};
