/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {ThemeProvider} from './context/ThemeContext';
import {AppProvider} from './context/AppContext';
import { I18nManager } from 'react-native';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

// Disable RTL
if (I18nManager.isRTL) {
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);
  if (Platform.OS === 'android') {
    Alert.alert('Restart', 'Please restart the app for the changes to take effect.', [
      { text: 'OK', onPress: () => RNRestart.Restart() },
    ]);
  } else {
    Alert.alert('Restart', 'Please restart the app for the changes to take effect.');
  }
}

let AppWithTheme = () => (
  <AppProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AppProvider>
);
AppRegistry.registerComponent('ataa', () => AppWithTheme);
