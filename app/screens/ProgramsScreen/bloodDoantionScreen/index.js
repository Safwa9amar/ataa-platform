import {Image, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {useTheme} from '../../../context/ThemeContext';
import Icon from '../../../components/Icon';
import CustomScreenHeader from '../../../components/CustomScreenHeader';
import bloodDoantionScreenImg from '../../../assets/images/Bloodonationpana.png';
import newDamandImg from '../../../assets/images/image37.png';
import SuiviDamandImg from '../../../assets/images/image38.png';
import bloodDonationForace from '../../../assets/images/bloodDonationForace.png';
import CampaignsCard from '../../../components/CampaignsCard';
import Text from '../../../components/Text';
import ScreensContainer from '../../../components/ScreensContainer';
import completedCampaignImg from '../../../assets/images/7b4cb425de2d-newsstory1178x589.png';
import appointmentBooking from '../../../assets/images/appointment-booking.jpg';

export default function BloodDonationScreen({navigation}) {
  const {isDarkMode, theme} = useTheme();
  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader
          icon={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
                gap: 5,
              }}>
              <Icon.Entypo name="drop" size={24} color={theme.textColor} />
              <Icon.MaterialCommunityIcons
                onPress={() => {
                  navigation.navigate('BloodDonationCondittion');
                }}
                name="dots-vertical"
                size={24}
                color={theme.textColor}
              />
            </View>
          }
          navigation={navigation}
          label="التبرع بالدم"
        />
      ),
    });
  }, [navigation, isDarkMode]);
  return (
    <ScreensContainer
      style={{
        padding: 10,
        gap: 15,
      }}>
      <Image
        source={bloodDoantionScreenImg}
        style={{width: '100%', height: 225, borderRadius: 10}}
      />
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,
          color: theme.textColor,
        }}
        type="md">
        تتيح لك منصة عطاء الفرصة لإنقاذ حياة من خلال تبرعك بالدم
      </Text>
      <CampaignsCard
        Fontisto
        iconName={'blood'}
        label={'فرص التبرع بالدم'}
        description={'عرض فرص التبرع المتاحة'}
        image={bloodDonationForace}
        onPress={() => navigation.navigate('BloodDonationOpportunities')}
      />
      <CampaignsCard
        onPress={() =>
          navigation.navigate('CreateCampagnScreen', {
            type: 'BLOOD',
          })
        }
        MaterialIcons
        iconName={'add-box'}
        label={'إنشاء حملة'}
        description={'أنشىء حملة تبرع بالدم'}
        image={newDamandImg}
      />
      <CampaignsCard
        onPress={() => {
          navigation.navigate('MyBloodCampagn');
        }}
        MaterialIcons
        iconName={'auto-graph'}
        label={'حملاتي'}
        description={'متابعة الحملات التي قمت بإنشائها'}
        image={SuiviDamandImg}
      />
      <CampaignsCard
        onPress={() => {
          navigation.navigate('MyAppointments');
        }}
        MaterialIcons
        iconName={'auto-graph'}
        label={'مواعيدي'}
        description={'متابعة المواعيد التي قمت بحجزها'}
        image={appointmentBooking}
      />
      
       <CampaignsCard
        onPress={() => navigation.navigate('CompletedCampaignBloodDonation')}
        iconName={'megaphone'}
        Ionicons
        label={'حملاتي المكتملة'}
        description={'الحملات التي تم جمع الوحدات المطلوبة لها'}
        image={completedCampaignImg}
      />
    </ScreensContainer>
  );
}
