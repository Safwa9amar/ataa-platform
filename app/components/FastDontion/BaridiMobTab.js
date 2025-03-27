import React, { useState } from 'react';
import { View, Pressable, Image, PermissionsAndroid, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Text from '../Text';
import Icon from '../Icon';
import { launchImageLibrary } from 'react-native-image-picker';
import { shadowStyles } from './shadowStyles';

const BaridiMobTab = ({ setRecipientPhoto, recipientPhoto }) => {
  const { theme } = useTheme();
  const image = recipientPhoto?.assets[0]?.uri;

  const handleCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchImageLibrary({ mediaType: 'photo' }, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            setRecipientPhoto(response);
          }
        });
      } else {
        Alert.alert('Permission Denied', 'Camera permission is required to select a photo.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text center type="md">
        يمكنك القيام بتحويل المبلغ المطلوب عبر الحساب البنكي التالي
      </Text>
      <Text type="md">{process.env.APP_CCPNAME}</Text>
      <Text type="md">{process.env.APP_BARIDIMOB_NUMBER}</Text>
      <Text type="md">
        يتعين عليك ارسال الايصاال هنا من اجل معالجة طلب تبرعك
      </Text>
      <Pressable onPress={handleCamera} style={[styles.button, { backgroundColor: theme.mangoBlack }]}>
        <Icon.AntDesign name="camera" size={30} />
        <Text type="sm">رفع صورة وصل عملية الدفع</Text>
        <Image style={styles.icon} source={require('../../assets/images/baridiMob.png')} />
      </Pressable>
      <Image style={styles.image} source={image ? { uri: image } : require('../../assets/images/image42.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    ...shadowStyles,
  },
  icon: {
    width: 30,
    height: 30,
  },
  image: {
    width: '100%',
    height: 150,
  },
});

export default BaridiMobTab;
