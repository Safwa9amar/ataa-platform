import React, {useLayoutEffect} from 'react';
import {StyleSheet} from 'react-native';
import ProgrammeCard, {CustomImg} from '../../components/ProgrammeCard';
import zakatImg from '../../assets/images/zakat.png';
import adahiImg from '../../assets/images/adahi.png';
import tabaroaImg from '../../assets/images/tabaroa.png';
import sofaraaImg from '../../assets/images/sofaraa.png';
import ScreensContainer from '../../components/ScreensContainer';
import {useTheme} from '../../context/ThemeContext';
import hamaltPG from '../../assets/images/hamaltPG.png'
import SearchBar from '../../components/SearchBar';

const DefaultScreen = ({navigation}) => {
  const {theme} = useTheme();

  return (
    <ScreensContainer style={styles.container}>
      <ProgrammeCard
        img={<CustomImg src={hamaltPG} />}
        title="الحملات"
        description="المساهمة مع منصة عطاء في جمع التبرعات للمجالات الخيرية المختلفة لتشارك في تحقيق التعاون و التكافل وتترك أثر ذا بصمة طيبة في حياة الآخرين"
        theme={theme}
        onPress={() => navigation.navigate('Campagnes', {type : "all"})}
      />
      <ProgrammeCard
        title="الزكاة"
        description="برنامج يتيح لك إمكانية حساب الزكاة بأنواعها المختلفة ودفعها عبر طرق سهلة و سريعة لتصل إلى مستحقي"
        theme={theme}
        img={<CustomImg src={zakatImg} />}
        onPress={() => navigation.navigate('ZakatScreen')}
      />
      <ProgrammeCard
        title="الاضاحي"
        description="برنامج لتوكيل جمع الأضاحي و العقيقة و الصدقة والعيد وتوزيعها كاملة على مستحقيها"
        theme={theme}
        img={<CustomImg src={adahiImg} />}
        onPress={() => navigation.navigate('AdahiScreen')}
      />
      <ProgrammeCard
        title="التبرع بالدم"
        description="تتيح لك منصة عطاء الفرصة لإنقاذ حياة من خلال تبرعك بالدم"
        theme={theme}
        img={<CustomImg src={tabaroaImg} />}
        onPress={() => navigation.navigate('BloodDonation', {type : "blood"})}
      />
      <ProgrammeCard
        title="سفراء"
        description="خدمة تتيح لك نشر فرص التبرع عبر وسائل التواصل الاجتماعي وكسب نقاط من التبرعات التي قام بها الآخرين عن طريق نشرك"
        theme={theme}
        img={<CustomImg src={sofaraaImg} />}
        onPress={() => navigation.navigate('AmbassadorsScreen')}
      />
    </ScreensContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: 'center',
    marginTop:20,
  },
  svg: {
    borderRadius: 10,
    zIndex: 100,
    transform: [{translateX: 25}],
    // add shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default DefaultScreen;
