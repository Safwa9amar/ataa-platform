import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import ScreensContainer from "../components/ScreensContainer";
import CustomHeader from "../components/CustomScreenHeader";
import MyMarkDown from "../components/MyMarkdown";
import Fulllogo from "../assets/logo/fullLogo.png";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import API_ENDPOINTS from "../config/config";
import { useCredentials } from "../context/CredentialsContext";
import CollapsibleItem from "../components/CollapsibleItem";
import Text from "../components/Text";

export default function AppGuideScreen() {
  const navigation = useNavigation();
  const { userToken } = useCredentials();
  const { theme } = useTheme();
  const [images, setImages] = useState([]);
  const { setHideNavbar } = useHideNavbar();

  useEffect(() => {
    fetch(API_ENDPOINTS.APP.GUID)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
      });
  }, []);

  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      header: () => (
        <CustomHeader
          label={"دليل التطبيق"}
          theme={theme}
          navigation={navigation}
        />
      ),
    });
    return () => {
      setHideNavbar(false);
    };
  }, [navigation]);

  return (
    <ScreensContainer style={{ paddingHorizontal: 10 }}>
      <MyMarkDown>
        {`
 ![A local image]( ${images.fullLogo} "")

مرحبًا بكم في منصة "عطاء"، حيث نؤمن بأهمية تسهيل وصول مستخدمي المنصة إلى كافة الخدمات. نحن نقوم بتحديث تطبيقاتنا باستمرار لإضافة الميزات التي تجعل من استخدام المنصة أمرًا في منتهى السهولة. كما نعمل جاهدين على توفير التكنولوجيا التي تساهم في دمج الأشخاص ذوي الاحتياجات الخاصة في العمل الخيري والتنموي، لضمان أن يكون استخدام المنصة في متناولهم في القريب العاجل ويشمل ذلك:

- توفير واجهة مستخدم سلسلة و سهلة التصفح.
- إدراج التسميات التوضيحية للخيارات و القوائم و عناصر التحكم.
- إدراج أوصاف الصور.
- دعم برامج قراءة الشاشة و أسطر بريل الإلكترونية (قيد التطوير).
- دعم التحكم في حجم الخط لمساعدة ضعاف البصر (قيد التطوير).
- دعم البحث الصوتي (قيد التطوير).



## 2/ وصف عام للتطبيق
ينقسم تطبيق منصة عطاء إلى ثلاث أقسام رئيسية و هي على النحو التالي:

### 2-1/ الشريط العلوي


![A local image]( ${images.header} "")

ويحوي شعار المنصة، عنوان الشاشة الحالية، أزرار الرجوع، السلة، حساب المستخدم، الإشعارات، التبرع السريع وذلك حسب الشاشة التي يجري تصفحها وهي على النحو التالي:

- **الإشعارات**:  

 ![A local image]( ${images.ring2} "")
 

  يؤدي الضغط على هذا التبويب إلى إنتقالك إلى صفحة الإشعارات أين يمكنك الإطلاع على مختلف الإشعارات التي نرسلها عبر التطبيق.

- **التبرع السريع**:  

 ![A local image]( ${images.fastDonation2} "")

  يؤدي الضغط على هذا التبويب إلى فتح مربع التبرع السريع التفاعلي، الذي يمكنك من التبرع للفرص الأشد احتياجاً خلال ثوان، ويمكنك بضغطة على الشاشة إغلاقه، والعودة إلى علامة التبويب السابقة.

- **حساب المستخدم**:  

 ![A local image]( ${images.menu2} "")

  يؤدي الضغط على هذا التبويب إلى فتح مستطيل طولي تفاعلي وتحتوي هذه الشاشة على (حساب المستخدم، معلومات الرصيد، معلومات التبرع، عن عطاء، دليل التطبيق، التعليقات و المساعدة، تواصل معنا). قد تختلف الشاشة حسب طبيعة الحساب و طريقة التبرع.

### 2-2/ منطقة المحتوى

![A local image]( ${images.body} "")

تشغل الجزء الأكبر من الشاشة و تحوي عناصر الشاشة الحالية و خياراتها.

### 2-3/ منطقة شريط التنقل

![A local image]( ${images.footer} "")

تمتد إلى أسفل الشاشة في تبويبات متجانبة ويؤدي الضغط على أحداها إلى نقل المستخدم إلى أحد أقسام التطبيق الرئيسية وهي على النحو التالي:

- **الرئيسية**:  

![A local image]( ${images.main} "")

  تحوي هذه الشاشة عدداً من الفرص المميزة، إضافة إلى قسم أرقام عطاء الذي يعرض عدداً من الإحصائيات حول المنصة.

- **فرص التبرع**:  

![A local image]( ${images.donation} "")

  تحوي هذه الشاشة كافة فرص التبرع وهي مقسمة إلى عدة أقسام يمكن الاختيار من بينها بالضغط على أحد التبويبات أسفل شريط التنقل العلوي.

- **متجر التبرع**:  

![A local image]( ${images.store} "")

  قسمت هذه الشاشة إلى قسمين حيث يحتوي القسم الأول على متجر التبرع أي تعرض مختلفة المنتجات و السلع المقابلة للتبرع و يحتوي القسم الثاني على فرص تبرع المتجر و الذي يعترض فرص تبرع مختلفة و متنوعة تشارك في كونها بحاجة لمواد عينية للتبرع بها.

- **برامجنا**:  

![A local image]( ${images.ourPg} "")

  تحوي هذه الشاشة كافة برامج عطاء (حملات، حاسبة الزكاة، التبرع بالدم، سفراء عطاء).

## 3/ تسميات الخيارات والقوائم وعناصر التحكم

تمت تسمية جميع الخيارات والقوائم وعناصر التحكم بما يضمن وضوحها لكافة المستخدمين.

## 4/ التعليقات والمساعدة

نسعى في منصة عطاء إلى توفير تجربة مميزة لكافة المستخدمين؛ لذا نقوم بتطوير مزايا المنصة باستمرار، إضافة إلى تحديث هذه الشاشة دورياً كما يسعدنا تلقي استفساراتكم وتعليقاتكم واقتراحاتكم الخاصة بتحسين التطبيق، وذلك عبر تبويب تواصل معنا المتواجد في حساب المستخدم أو من خلال البريد الإلكتروني.

  
`}
      </MyMarkDown>
    </ScreensContainer>
  );
}
