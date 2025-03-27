import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProgressBarMultiStep from "react-native-progress-bar-multi-step";
import {
  KeyboardAvoidingView,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../../../context/ThemeContext";
import { useHideNavbar } from "../../../../context/NavbarVisibilityContext";
import { HeaderRight } from "../../../../navigation/Header";
import Proof from "./Proof";
import Personal from "./Personal";
import Address from "./Address";
import Other from "./Other";
import Icon from "../../../../components/Icon";
import ModelWrapper from "../../../../components/ModelWrapper";
import { CheckBoxLabled } from "../../../../components/CheckBox";
import PrimaryBtn from "../../../../components/PrimaryBtn";
import { useCreateCampaign } from "../../../../context/CreateCampaignContext";
import ScreensContainer from "../../../../components/ScreensContainer";
import MyMarkDown from "../../../../components/MyMarkdown";
import { ActivityIndicator } from "react-native";
import {
  createCampaign,
  saveCampaignToAPI,
} from "../../../../services/campaignServices copy";
import { useCredentials } from "../../../../context/CredentialsContext";
import AlertMessage from "../../../../components/AlertMessage";
import Unlogged from "../../../../components/Unlogged";
import useFileUpload from "../../../../hooks/useFileUpload";
import uploadFileService from "../../../../services/uploadFileService";
import Text from "../../../../components/Text";
import { createImage } from "../../../../services/imageService";

const MultiStepsNavigator = createNativeStackNavigator();

const CreateCampagnScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { state, update, reset } = useCreateCampaign();
  const { user, userToken, isLoggedIn } = useCredentials();
  const { setHideNavbar } = useHideNavbar();
  const [page, setPage] = useState(1);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createtionMessage, setCreatetionMessage] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isuploading, setISUploading] = useState(false);
  const deletedPagesRef = useRef([]);
  const initialPages = [
    {
      key: 1,
      name: "Personal",
      component: Personal,
      title: "معلومات",
      pageNo: 1,
      isDone: false,
      props: { setPageStatus },
    },
    {
      key: 2,
      name: "Address",
      component: Address,
      title: "المنطقة",
      pageNo: 2,
      isDone: false,
      props: { setPageStatus },
    },
    {
      key: 3,
      name: "Other",
      component: Other,
      title: "الحملة",
      pageNo: 3,
      isDone: false,
      props: { deletePage, restorePage, setPageStatus },
    },
    {
      key: 4,
      name: "Proof",
      component: Proof,
      title: "الاثبات",
      pageNo: 4,
      isDone: false,
      props: { setPageStatus },
    },
  ];

  const [activePages, setActivePages] = useState(initialPages);

  const closeModel = () => {
    setIsModelOpen(false);
  };

  function deletePage(pageName) {
    const pageToDelete = activePages.find((page) => page.name === pageName);
    if (pageToDelete) {
      deletedPagesRef.current.push(pageToDelete);
      setActivePages((prevPages) =>
        prevPages.filter((page) => page !== pageToDelete)
      );
      if (page > activePages.length) {
        setPage(activePages.length);
      }
    }
  }

  function restorePage() {
    const lastDeletedPage = deletedPagesRef.current.pop();
    if (lastDeletedPage) {
      setActivePages((prevPages) => [
        ...new Set([...prevPages, lastDeletedPage]),
      ]);
    }
  }

  function setPageStatus(pageName, isDone) {
    setActivePages((prevPages) =>
      prevPages.map((page) =>
        page.name === pageName ? { ...page, isDone } : page
      )
    );
  }

  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      headerTitle: "إنشاء حملة",
      headerShown: true,
      headerStyle: { backgroundColor: theme.navBg },
      headerRight: () => <HeaderRight />,
    });

    return () => {
      setHideNavbar(false);
    };
  }, []);

  useEffect(() => {
    try {
      const navigateToScreen = (screenName) =>
        navigation.navigate(screenName, { type: route.params?.type });
      switch (page) {
        case 1:
          navigateToScreen("Personal");
          break;
        case 2:
          navigateToScreen("Address");
          break;
        case 3:
          navigateToScreen("Other");
          break;
        case 4:
          activePages.some((page) => page.name === "Proof") &&
            navigateToScreen("Proof");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error navigating to screen:", error.message);
    }
  }, [page]);

  const next = () => {
    if (activePages[page - 1]?.isDone) {
      setShowAlert(false);
      setPage((prevPage) =>
        prevPage < activePages.length ? prevPage + 1 : prevPage
      );
    } else {
      setShowAlert(true);
      setCreatetionMessage({
        type: "info",
        message:
          "يجب اكمال الصفحة الحالية وملئ جميع الحقول الفارغة حتى تتمكن من المتابعة",
      });
    }
  };

  const back = () =>
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));

  const handleCreateCampaign = useCallback(async () => {
    update("message", null);
    update("createdByuserId", user.id);

    if (!state.isAgreed) {
      setCreatetionMessage({
        type: "error",
        message: "يجب الموافقة على الشروط والأحكام لإنشاء الحملة",
      });
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    setISUploading(true);

    try {
      // Upload files and create campaign concurrently

      setISUploading(false);
      console.log(state);

      const data = await createCampaign(state, userToken);
      if (!data) {
        console.error("Error creating campaign:", data);
        throw new Error("حدث خطأ أثناء إنشاء الحملة يرجى المحاولة مرة أخرى");
      }

      // Success case
      setCreatetionMessage({
        type: "success",
        message: "تم إنشاء الحملة بنجاح",
      });
      setShowAlert(true);
      // reset();
      setPage(1);
      update("createdByuserId", user.id);

      setTimeout(() => {
        closeModel();
      }, 2000);
    } catch (error) {
      console.error("Error creating campaign:", error.message);
      setCreatetionMessage({
        type: "error",
        message:
          error.message || "حدث خطأ أثناء إنشاء الحملة يرجى المحاولة مرة أخرى",
      });
      setShowAlert(true);
    } finally {
      closeModel();
      setIsLoading(false);
    }
  }, [state]);

  if (!isLoggedIn) {
    return (
      <Unlogged comeFrom={"CreateCampagnScreen"} navigation={navigation} />
    );
  }
  return (
    <ScreensContainer contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="height"
        keyboardVerticalOffset={-200}
      >
        <MultiStepsNavigator.Navigator
          screenListeners={({}) => ({
            beforeRemove: (e) => {
              e.data.action.type === "GO_BACK" && back();
            },
          })}
          screenOptions={{
            header: () => (
              <>
                {showAlert && (
                  <AlertMessage
                    message={createtionMessage.message}
                    type={createtionMessage.type}
                    isVisible={showAlert}
                    onClose={() => setShowAlert(false)}
                    onConfirm={() => setShowAlert(false)}
                  />
                )}
                <ProgressBarMultiStep
                  containerStyle={styles.progressBarContainer}
                  circleStyle={styles.progressBarCircle}
                  stepNumberStyle={styles.progressBarStepNumber}
                  lineStyle={styles.progressBarLine}
                  progressive
                  page={page}
                  setPage={activePages.every((page) => page.isDone) && setPage}
                  tabs={[...new Set(activePages)]}
                />
              </>
            ),
            animation: "fade",
            contentStyle: { gap: 20, backgroundColor: theme.backgroundColor },
          }}
        >
          {[...new Set(activePages)].map((page) => (
            <MultiStepsNavigator.Screen
              key={page.name}
              name={page.name}
              children={(props) => (
                <page.component {...props} {...page.props} />
              )}
            />
          ))}
        </MultiStepsNavigator.Navigator>
        <View style={styles.bottomNav(theme.navBg)}>
          {activePages.every((page) => page.isDone) ? (
            <PrimaryBtn
              title={" انشاء الحملة"}
              onPress={() => setIsModelOpen(true)}
            />
          ) : (
            <>
              <Icon.FontAwesome5
                style={{
                  backgroundColor: theme.buttonPrimary,
                  padding: 5,
                  borderRadius: 50,
                }}
                name={"arrow-alt-circle-left"}
                size={30}
                color={theme.white}
                onPress={next}
              />
              {page < activePages.length && (
                <Icon.FontAwesome5
                  style={{
                    backgroundColor: theme.buttonPrimary,
                    padding: 5,
                    borderRadius: 50,
                  }}
                  name={"arrow-alt-circle-right"}
                  size={30}
                  color={theme.white}
                  onPress={back}
                />
              )}
            </>
          )}
        </View>
        <ModelWrapper
          height="60%"
          isModelOpen={isModelOpen}
          closeModel={closeModel}
        >
          <ScrollView disableScrollViewPanResponder>
            <MyMarkDown>
              {`
### شروط انشاء الحملة
- يجب أن يكون لديك حساب نشط.
- يجب تقديم معلومات شخصية كاملة وصحيحة.
- يجب تقديم معلومات دقيقة حول المنطقة المستهدفة.
- يجب تقديم تفاصيل واضحة عن الحملة وأهدافها.
`}
            </MyMarkDown>
          </ScrollView>
          <CheckBoxLabled
            checked={state.isAgreed}
            onPress={() => update("isAgreed", !state.isAgreed)}
            label="أوافق على الشروط"
          />
          <ActivityIndicator animating={isLoading} color={theme.primary} />
          {isuploading && (
            <Text type="sm">جاري رفع الملفات والصور يرجى الانتظار ...</Text>
          )}
          <PrimaryBtn
            title={"تأكيد انشاء الحملة"}
            onPress={handleCreateCampaign}
          />
        </ModelWrapper>
      </KeyboardAvoidingView>
    </ScreensContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressBarContainer: { flexDirection: "row-reverse" },
  progressBarCircle: { width: 30, height: 30 },
  progressBarStepNumber: { fontSize: 15 },
  progressBarLine: { width: 30, height: 0 },
  bottomNav: (bg) => ({
    position: "absolute",
    width: "100%",
    backgroundColor: bg,
    bottom: -10,
    flexDirection: "row",
    gap: 10,
    padding: 15,
  }),
});

export default CreateCampagnScreen;
