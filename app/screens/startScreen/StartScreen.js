import React, {useEffect, useState, useMemo, useLayoutEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import startScreenArrow2 from '../../assets/icons/startScreenArrow2.png';
import startScreenArrow3 from '../../assets/icons/startScreenArrow3.png';
import startScreenArrow4 from '../../assets/icons/startScreenArrow4.png';
import {useHideNavbar} from '../../context/NavbarVisibilityContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FourthScreen, SecondScreen, ThirdScreen} from './CustomScreen';
import Text from '../../components/Text';

const Tabs = createNativeStackNavigator();

const StartScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [progress, setProgress] = useState(0);
  const {setHideNavbar, toggleNavbar} = useHideNavbar();

  useLayoutEffect(() => {
    setHideNavbar(true);
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      statusBarColor: background,
      headerShown: false,
    });

    switch (progress) {
      case 0:
        navigation.navigate('SecondScreen');
        break;
      case 1:
        navigation.navigate('ThirdScreen');
        break;
      case 2:
        navigation.navigate('FourthScreen');
        break;
      case 3:
        AsyncStorage.setItem('usingForFirstTime', 'false');
        navigation.navigate('Home');
        toggleNavbar();
        break;
      default:
        break;
    }
  }, [progress]);

  const next = () => {
    if (progress === 3) return;
    setProgress(prevProgress => prevProgress + 1);
  };

  const background = useMemo(() => {
    const colorMap = {
      0: '#C2EEA9',
      1: '#FFBACF',
      2: '#FDD97F',
    };
    return colorMap[progress] || theme.backgroundColor;
  }, [progress, theme.backgroundColor]);

  const skip = () => {
    navigation.navigate('Home');
    toggleNavbar();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-evenly',
        padding: 20,
        backgroundColor: background,
      }}>
      <View style={{height: 500}}>
        <Tabs.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_left',
            contentStyle: {
              backgroundColor: background,
            },
          }}>
          <Tabs.Screen name="SecondScreen" component={SecondScreen} />
          <Tabs.Screen name="ThirdScreen" component={ThirdScreen} />
          <Tabs.Screen name="FourthScreen" component={FourthScreen} />
        </Tabs.Navigator>
      </View>

      <NavDots progress={progress} setProgress={setProgress} />
      <Next next={next} progress={progress} />
      <Skip skip={skip} />
    </View>
  );
};

const NavDots = ({progress, setProgress, totalScreens = 3}) => {
  const renderDots = () => {
    const dots = [];
    for (let i = totalScreens; i >= 1; i--) {
      dots.push(
        <TouchableOpacity
          key={i}
          onPress={() => {
            setProgress(i - 1);
          }}>
          <View
            style={{
              width: 40,
              height: 10,
              borderRadius: 4,
              backgroundColor: progress === i - 1 ? '#3A29E8' : '#D9D9D9',
            }}></View>
        </TouchableOpacity>,
      );
    }
    return dots;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}>
      {renderDots()}
    </View>
  );
};

const Skip = ({skip}) => {
  return (
    <TouchableOpacity
      style={{position: 'absolute', bottom: 20, right: 20}}
      title="Skip"
      onPress={skip}>
      <Text
        style={{color: '#eee', textDecorationLine: 'underline'}}
        type="bodyText">
        تخطي
      </Text>
    </TouchableOpacity>
  );
};

const Next = ({next, progress}) => {
  const arrowImages = [startScreenArrow2, startScreenArrow3, startScreenArrow4];
  const source = arrowImages[progress] || null;
  return (
    <TouchableOpacity onPress={next}>
      {source && (
        <Image
          style={{
            alignSelf: 'center',
            width: 100,
            height: 100,
          }}
          source={source}
        />
      )}
    </TouchableOpacity>
  );
};

export default StartScreen;
