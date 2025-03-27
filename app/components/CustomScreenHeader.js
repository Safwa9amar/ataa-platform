// CustomHeader.js
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Text from './Text';
import {useTheme} from '../context/ThemeContext';
import {useHideNavbar} from '../context/NavbarVisibilityContext';
import ModelWrapper from './ModelWrapper';
import { useDonationModalContext } from '../context/DonationModalContext';
// import DonateNowModal from '../modal/donation/DonateNowModal';

const CustomScreenHeader = ({navigation, label, icon}) => {
  // const {showDonationModal, closeDonationModal} = useDonationModalContext();
  const {theme} = useTheme();
  const {setHideNavbar} = useHideNavbar();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: icon ? 'space-between' : 'flex-end',
        alignItems: 'center',
        backgroundColor: theme.navBg,
        height: 60,
        paddingHorizontal: 10,
      }}>
      {icon}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}
        onPress={() => {
          navigation.goBack();
          setHideNavbar(false);
        }}>
        <Text type="bodyTextSmall">{label}</Text>
        <AntDesign name="arrowright" size={22} color={theme.textColor} />
      </TouchableOpacity>
      {/* <ModelWrapper
          closeModel={closeDonationModal}
          isModelOpen={showDonationModal}
          height="85%"
        >
          <DonateNowModal />
        </ModelWrapper> */}
    </View>
  );
};

export default CustomScreenHeader;
