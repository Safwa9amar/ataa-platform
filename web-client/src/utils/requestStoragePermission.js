import { PermissionsAndroid, Platform, Alert } from 'react-native';

async function requestStoragePermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to select files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access the storage');
        // Proceed with your file picking or other operations here
      } else {
        console.log('Storage permission denied');
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to select files. Please grant permission.',
        );
      }
    }
  } catch (err) {
    console.warn(err);
  }
}

export default requestStoragePermission;