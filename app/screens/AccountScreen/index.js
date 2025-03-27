import React, {useEffect, useLayoutEffect} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHideNavbar} from '../../context/NavbarVisibilityContext';
import Text from '../../components/Text';
import WaveSvg from '../../assets/vectors/WavesSvg';
import {useTheme} from '../../context/ThemeContext';


import { Platform } from "react-native";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}


const LoginFirstPage = ({navigation}) => {
  const {toggleNavbar} = useHideNavbar();
  const {theme} = useTheme();

  useLayoutEffect(() => {
    toggleNavbar();

    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLoginPress = () => {
    // Handle login button press
    navigation.navigate('Login', {screen: 'LoginForm'});
  };

  const handleSignUpPress = () => {
    navigation.navigate('Login', {screen: 'SignUpForm'});
    // Handle sign up button press
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <View style={{alignItems: 'center', marginBottom: 100}}> */}
      <Image
        // sharedTransitionTag="tag"
        style={{width: 180, height: 180, marginBottom: 20}}
        source={require('../../assets/logo/logoWithCircle.png')}
      />
      <Text>مرحبا بك في عائلة</Text>
      <Image
        style={{width: 200, height: 100}}
        source={require('../../assets/logo/logoText.png')}
      />
      <Text
        style={{
          color: theme.steel,
        }}>
        انت على وشك احداث التغيير
      </Text>
      {/* </View> */}

      <TouchableOpacity onPress={handleSignUpPress}>
        <LinearGradient
          colors={['#22C6CB', '#01E441']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            marginTop: 50,
            width: 250,
            padding: 5,
            height: 40,
            borderRadius: 30,
            marginVertical: 10,
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>انشاء حساب</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLoginPress}>
        <View
          style={{
            width: 250,
            padding: 5,
            height: 40,
            borderRadius: 30,
            marginVertical: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.steel,
          }}>
          <Text style={{color: theme.textColor, textAlign: 'center'}}>
            تسجيل الدخول
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <WaveSvg />
      </View>
    </View>
  );
};

export default LoginFirstPage;
