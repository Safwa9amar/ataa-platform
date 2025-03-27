import React from 'react';
import {View, Image} from 'react-native';
import Text from '../../components/Text';
const SCREEN_DATA = [
  {
    imageSource: require('../../assets/images/startScreen1.png'),
    heading: 'فرص تبرع متنوعة',
    bodyText:
      'جهودنا الخيرية تشمل مجالات متنوعة، من التعليم إلى الرعاية الصحية، مستهدفين الفئات الأشد احتياجًا. نسعى لتحقيق تأثير إيجابي من خلال التركيز على احتياجات المجتمع وتحسين جودة الحياة للأفراد المحتاجين.',
  },
  {
    imageSource: require('../../assets/images/startScreen2.png'),
    heading: 'طرق دفع آمنة و سهلة',
    bodyText:
      'توفير خيارات متعددة لعملية التبرع والعطاء، تسهل على المتبرعين اختيار الوسيلة المناسبة لهم، سواء عبر الإنترنت، التحويل البنكي، أو الطرق الرقمية، بهدف تعزيز سهولة ويسر عملية الدعم والمساهمة في الأعمال الخيرية.',
  },
  {
    imageSource: require('../../assets/images/startScreen3.png'),
    heading: 'متابعة الإحصائية الخاصة',
    bodyText:
      'من خلال فحص سجلات تبرعاتك السابقة عبر حسابك الشخصي، يمكنك تتبع وتحليل مساهماتك الخيرية السابقة بكل سهولة. هذا يساعد في فهم استمراريتك في الدعم وتحديد المجالات التي قد تحتاج إلى اهتمام إضافي.',
  },
  {
    // Add more screens as needed
    customContent: <Text>Fifth Screen</Text>,
  },
];

const CustomScreen = ({imageSource, heading, bodyText, customContent}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {imageSource && (
        <Image style={{width: 300, height: 300}} source={imageSource} />
      )}
      {heading && (
        <Text center type="headingMedium">
          {heading}
        </Text>
      )}
      {bodyText && (
        <Text style={{width: 300}} center type="bodyTextSmall">
          {bodyText}
        </Text>
      )}
      {customContent}
    </View>
  );
};

const FirstScreen = () => (
  <CustomScreen imageSource={require('../../assets/logo/logo.png')} />
);
const SecondScreen = () => <CustomScreen {...SCREEN_DATA[0]} />;
const ThirdScreen = () => <CustomScreen {...SCREEN_DATA[1]} />;
const FourthScreen = () => <CustomScreen {...SCREEN_DATA[2]} />;
const FifthScreen = () => <CustomScreen {...SCREEN_DATA[3]} />;

export {FirstScreen, SecondScreen, ThirdScreen, FourthScreen, FifthScreen};
