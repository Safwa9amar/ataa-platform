import React, { useState } from 'react';
import { View, Pressable, Image, PermissionsAndroid } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Text from '../Text';
import Icon from '../Icon';
import { launchImageLibrary } from 'react-native-image-picker';
import { shadowStyles } from './shadowStyles';
const BaridiTab = ({setRecipientPhoto, recipientPhoto}) => {
  const { theme } = useTheme();
  const image = recipientPhoto?.assets[0].uri;
  

  const handleCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchImageLibrary({ mediaType: 'photo',  }, image => {
          if (image) setRecipientPhoto(image);
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <Text type="md">
        للدفع عن طريق ccp يرجى التوجه الى اقرب مكتب بريد وارسال المبلغ المحدد اعلاه الى الحساب الخاص بعطاء
      </Text>
      <Text type="md">{process.env.APP_CCPNAME}</Text>
      <Text type="md">{process.env.APP_CCPNUMBER}</Text>
      <Text type="md">يتعين عليك ارسال الايصاال هنا من اجل معالجة طلب تبرعك</Text>
      <Pressable
        onPress={handleCamera}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          gap: 10,
          backgroundColor: theme.mangoBlack,
          borderRadius: 10,
          margin: 10,
          padding: 20,
          ...shadowStyles,
        }}>
        <Icon.AntDesign name="camera" size={30} />
        <Text type="sm">رفع صورة وصل عملية الدفع</Text>
        <Image style={{ width: 30, height: 30 }} source={require('../../assets/images/ccp.jpg')} />
      </Pressable>

      <Image style={{ width: '100%', height: 150 }} source={image ? { uri: image } : require('../../assets/images/image42.png')} />
    </View>
  );
};

export default BaridiTab;
