import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useLayoutEffect,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import ScreensContainer from '../components/ScreensContainer';
import Text from '../components/Text';
import {useTheme} from '../context/ThemeContext';
import {useHideNavbar} from '../context/NavbarVisibilityContext';

const Stack = createNativeStackNavigator();

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {setHideNavbar} = useHideNavbar();

  useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      header: () => (
        <CustomScreenHeader
          label={'اتصل بنا'}
          theme={theme}
          navigation={navigation}
        />
      ),
    });
    return () => {
      setHideNavbar(false);
    }
  }, [navigation]);

  const RenderContactOption = ({icon, onPress, backgroundColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: backgroundColor,
        height: 50,
        width: 50,
        borderRadius: 50,
      }}>
      {icon}
    </TouchableOpacity>
  );

  const [activeScreen, setActiveScreen] = useState('call');
  const setActiveAndNavigate = useCallback(
    screenName => {
      setActiveScreen(screenName);
      navigation.navigate(screenName);
    },
    [navigation],
  );

  const contactOptions = useMemo(
    () => [
      {name: 'Chat', icon: 'message-square'},
      {name: 'Mail', icon: 'mail'},
      {name: 'call', icon: 'phone-call'},
    ],
    [],
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          height: 900,
        }}
        keyboardShouldPersistTaps="handled">
        <Image
          style={{
            width: '90%',
            height: 210,
            alignSelf: 'center',
            marginTop: 20,
          }}
          source={require('../assets/images/contactUs.png')}
        />

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_bottom',
            contentStyle: {
              backgroundColor: theme.backgroundColor,
            },
          }}>
          <Stack.Screen name="call" component={CallUs} />
          <Stack.Screen name="Mail" component={MailUs} />
          <Stack.Screen name="Chat" component={ChatWithUs} />
        </Stack.Navigator>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
          position: 'absolute',
          bottom: 12,
          zIndex: 100,
          width: '100%',
        }}>
        <View
          style={{
            width: '90%',
            backgroundColor: theme.navBg,
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 10,
          }}>
          {contactOptions.map(option => (
            <RenderContactOption
              key={option.name}
              icon={
                <Feather
                  name={option.icon}
                  size={20}
                  color={
                    activeScreen === option.name ? theme.white : theme.black
                  }
                />
              }
              onPress={() => setActiveAndNavigate(option.name)}
              backgroundColor={
                activeScreen === option.name ? theme.buttonPrimary : 'white'
              }
            />
          ))}
        </View>
      </View>
    </>
  );
};

const CallUs = () => {
  const {theme} = useTheme();
  return (
    <ScreensContainer
      style={{...styles.container, backgroundColor: theme.mangoBlack}}>
      <ContactInfo label="المحمول" value="+213 674 020 244" />
      <ContactInfo label="الثابت" value="+213 674 020 244" />
      <ContactInfo label="واتس اب" value="+213 674 020 244" />
    </ScreensContainer>
  );
};

const ContactInfo = ({label, value}) => {
  const {theme} = useTheme();
  return (
    <View style={{marginBottom: 10}}>
      <Text style={{color: theme.steel}}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
};
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomScreenHeader from '../components/CustomScreenHeader';

const MailUs = () => {
  const {theme} = useTheme();

  return (
    <View
      style={{
        ...styles.MailUscontainer,
      }}>
      <InputField icon="mail" placeholder="البريد الالكتروني" />
      <InputField icon="user" placeholder="الاسم" textAlign="right" />
      <InputField icon="mobile1" placeholder="رقم الهاتف" />
      <View
        style={{
          borderColor: theme.steel,
          ...styles.textAreaContainer,
        }}>
        <TextInput
          style={[styles.textArea, {color: theme.textColor}]}
          multiline={true}
          numberOfLines={10}
          placeholder="اكتب رسالتك هنا"
          placeholderTextColor={theme.placeholderTextColor}
          textAlignVertical="top"
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: theme.buttonPrimary,
          ...styles.sendButton,
        }}>
        <Feather name="send" size={20} color={theme.white} />
        <Text type="bodyTextSmall" style={styles.sendButtonText}>
          ارسال
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const InputField = ({
  icon,
  fullIcon,
  iconSize = 24,
  placeholder,
  textAlign = 'left',
  style,
  secureTextEntry,
  color,
  ...props
}) => {
  const {theme} = useTheme();

  return (
    <View
      style={{
        borderBottomColor: theme.steel,
        ...styles.inputContainer,
        ...style,
      }}>
      {fullIcon ? (
        fullIcon
      ) : (
        <AntDesign
          name={icon}
          size={iconSize}
          color={color ? color : theme.textColor}
        />
      )}
      <TextInput
        secureTextEntry={secureTextEntry}
        style={[styles.input, {textAlign, color: theme.textColor}]}
        placeholder={placeholder}
        textAlign="right"
        placeholderTextColor={theme.placeholderTextColor}
        {...props}
      />
    </View>
  );
};

const ChatWithUs = () => {
  const {theme} = useTheme();
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={'height'}
      keyboardVerticalOffset={-120}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {backgroundColor: theme.mangoBlack},
        ]}
        keyboardShouldPersistTaps="handled">
        <View
          style={{
            borderColor: theme.steel,
            ...styles.textAreaContainer,
          }}>
          <TextInput
            style={[styles.textArea, {color: theme.textColor}]}
            multiline={true}
            numberOfLines={8}
            // disabled input
            editable={false}
            placeholder=""
            placeholderTextColor={theme.placeholderTextColor}
            textAlignVertical="top"
          />
        </View>
        <InputField
          style={{
            borderWidth: 1,
            borderColor: theme.steel,
            width: '100%',
            borderRadius: 10,
            marginTop: 20,
          }}
          fullIcon={
            <FontAwesome name="send" size={24} color={theme.buttonPrimary} />
          }
          placeholder="الرسالة"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 20,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    alignItems: 'flex-end',
  },
  MailUscontainer: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'column',
    gap: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,

    borderBottomWidth: 1,
  },
  input: {
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    fontSize: 18,
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,

    borderBottomWidth: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  textArea: {
    padding: 5,
    borderRadius: 10,
    width: '100%',
    fontSize: 18,
    textAlign: 'right',
  },
  sendButton: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    width: 150,
  },
  sendButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default ContactUsScreen;
