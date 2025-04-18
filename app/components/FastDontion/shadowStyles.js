import { Platform } from 'react-native';

export const shadowStyles = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  android: {
    elevation: 3,
  },
});
