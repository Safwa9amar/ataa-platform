import { View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import Feather from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import CollapsibleItem from "../components/CollapsibleItem";
import ScreensContainer from "../components/ScreensContainer";
import Text from "../components/Text";
import CustomScreenHeader from "../components/CustomScreenHeader";
const data = [
  {
    title: 'البند 1 : "مقدمة"',
    description:
      'تحرص منصة عطاء، المشار إليها فيما يلي بـ "منصة عطاء"، على تقديم أفضل مستويات الخدمة، وإدراكاً منها بأهمية وسرية البيانات، بما في ذلك بيانات المستخدم والبيانات المدخلة، تلتزم المنصة بالحفاظ على سرية وخصوصية هذه البيانات. لن تقوم المنصة بالكشف عن هذه المعلومات إلا وفقًا للضوابط المحددة في البند الرابع (الاستخدام والإفصاح عن البيانات)، تُعد سياسة الخصوصية وسرية المعلومات الموضحة أدناه جزءاً لا يتجزأ من شروط استخدام منصة عطاء.',
  },
  {
    title: 'البند 2 : "بيانات المستخدم"',
    description:
      'يشير مصطلح "بيانات المستخدم" إلى أي مما يلي :\n' +
      "* البيانات الشخصية المستخدمة أثناء عملية التسجيل.\n" +
      "* بيانات الاتصال والتحديثات المتعلقة بالاستخدام : وتشمل بيانات الاتصال والبيانات المتعلقة بالجهاز المستخدم للاتصال، مثل لغة الجهاز، نوع النظام، ونوع المتصفح.\n" +
      "* المعلومات المدخلة من قبل المستخدم : مثل طلبات الاستفسارات، البلاغات، والإجابات على أي استبيانات يتم عرضها عبر المنصة.",
  },
  {
    title: 'البند 3 : "جمع البيانات وتخزينها"',
    description:
      "* جمع البيانات : يوافق زائر منصة عطاء على قيام منصة عطاء بجمع بيانات المستخدم.\n" +
      "* تخزين البيانات : يتم تخزين بيانات المستخدم على الخوادم التي تحددها منصة عطاء داخل الجزائر، مع الالتزام بحماية هذه الخوادم من الاختراق والدخول غير المصرح به وفقًا للمعايير المتبعة.\n" +
      "* حذف بيانات الحساب : يمكن للمستخدم طلب حذف بياناته عن طريق تقديم طلب دعم فني عبر قنوات الدعم. سيتم حذف بيانات الحساب والملف الشخصي وتعديل العمليات المالية المرتبطة بالحساب لتكون تبرع غير مسجل (زائر).",
  },
  {
    title: 'البند 4 : "الإستخدام و الإفصاح عن البيانات"',
    description:
      "* يوافق المستخدم على السماح لمنصة عطاء، بما في ذلك الأشخاص المخولين من موظفيها والعاملين فيها، بالوصول إلى بيانات المستخدم.\n" +
      "* يوافق المستخدم على السماح باستخدام بياناته غير المحددة لهويته ضمن بيانات ومؤشرات إحصائية تراكمية، ومشاركتها مع الجهات ذات العلاقة حسب ما تراه منصة عطاء مناسباً.\n" +
      "* يوافق المستخدم على السماح بالإفصاح عن بياناته إلى الجهات غير الحكومية المصرح لها من الجهات المختصة بالقيام بأداء خدمات حكومية محددة.\n" +
      "* يقر المستخدم بعلمه بأن لمنصة عطاء الحق في كشف أي معلومات للجهات المختصة، عندما يكون ذلك ضرورياً للالتزام بأي قانون أو نظام أو طلب حكومي أو قضائي.",
  },
  {
    title: 'البند 5 : "الروابط الخارجية"',
    description:
      "قد تقدم منصة عطاء روابط لمواقع أو خدمات تابعة لأطراف أخرى، المنصة غير مسؤولة عن كيفية جمع أو استخدام هذه الأطراف لمعلومات التعريف الشخصية الخاصة بالمستخدم، على المستخدم الرجوع إلى إشعارات الخصوصية الخاصة بتلك المواقع للحصول على مزيد من المعلومات حول سياسات الخصوصية الخاصة بها.",
  },
  {
    title: 'البند 6 : "مسؤولية المستخدم تجاه حماية الخصوصية"',
    description:
      "بهدف حماية بيانات المستخدم، تنصح منصة عطاء بما يلي :\n" +
      "* الاتصال الفوري بالدعم الفني لمنصة عطاء عند الاشتباه في أن شخصًا آخر قد حصل على معلومات الدخول إلى حسابه في المنصة أو أي معلومات سرية أخرى.\n" +
      "* عدم إعطاء أي معلومات سرية عبر الهاتف أو شبكة الإنترنت ما لم يتم التأكد من هوية الشخص أو الطرف المستقبل للمعلومة.\n" +
      "* عدم مشاركة معلومات الدخول (اسم المستخدم وكلمة المرور) مع الآخرين.\n" +
      "* عدم السماح للآخرين باستخدام حساب المستخدم في منصة عطاء.\n" +
      "* استخدام المنصة من خلال جهاز إلكتروني آمن، مع إغلاق التطبيقات المتصلة بالإنترنت غير المستخدمة.\n" +
      "* التأكد من تحديث برنامج الحماية من الفيروسات بشكل دائم.",
  },
  {
    title: 'البند 7 : "التحديثات والشروط العامة"',
    description:
      "* لمنصة عطاء كامل الحرية في تحديث سياسة الخصوصية في أي وقت، بما في ذلك إضافة أو تغيير أي من أحكام سياسة الخصوصية. سيتم إشعار المستخدم بأي تحديث لهذه السياسة عن طريق البريد الإلكتروني المسجل. تحتفظ منصة عطاء بالحق في إنهاء حساب المستخدم في حال عدم قبول المستخدم لأي تغيير في سياسة الخصوصية.\n" +
      "* حالياً اللغة العربية هي اللغة المعتمدة لتطبيق الأحكام والشروط الخاصة بسياسة الخصوصية. في حال نشوء خلاف في تفسير أي نص ورد بأي لغة أخرى، يُعتَمد النص المكتوب باللغة العربية.\n" +
      "* تخضع سياسة الخصوصية لأنظمة الدولة الجزائرية. في حال نشوء خلاف يتعلق بها، فإن الجهة المختصة في الدولة الجزائرية هي المخولة بالنظر في الخلافات المتعلقة أو الناشئة عن سياسة الخصوصية.",
  },
];

export default function PrivacyPolicy() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { setHideNavbar } = useHideNavbar();

  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      header: () => (
        <CustomScreenHeader
          label={"سياسة الخصوصية"}
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
    <ScreensContainer style={{ padding: 20 }}>
      {data.map((item) => (
        <Item title={item.title} description={item.description} />
      ))}
    </ScreensContainer>
  );
}

const Item = ({ title, description, children }) => {
  const { theme } = useTheme();
  return (
    <CollapsibleItem
      key={1}
      label={title}
      style={{
        backgroundColor: theme.mangoBlack,
        borderRadius: 10,
        marginBottom: 10,
        padding: 30,
      }}
    >
      <Text
        type="bodyTextSmall"
        style={{
          padding: 10,
          color: theme.secondaryTextColor,
        }}
      >
        {description}
      </Text>
    </CollapsibleItem>
  );
};
