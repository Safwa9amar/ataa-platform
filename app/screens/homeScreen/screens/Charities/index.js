import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Comment from "./Comment";
import { useTheme } from "../../../../context/ThemeContext";
import CharitiesDisplay from "./CharitiesDisplay";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome";
import { useHideNavbar } from "../../../../context/NavbarVisibilityContext";
import { TouchableOpacity } from "react-native";
import ModelWrapper from "../../../../components/ModelWrapper";

// create stack navigator
const Tabs = createNativeStackNavigator();

const Charities = ({ navigation }) => {
  const { theme } = useTheme();
  const { toggleNavbar } = useHideNavbar();
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const showModel = () => {
    setIsModelOpen(true);
  };
  const closeModel = () => {
    setIsModelOpen(false);
  };

  return (
    <>
      <CharitiesDisplay showModel={showModel} />
      <ModelWrapper
        height="70%"
        closeModel={closeModel}
        isModelOpen={isModelOpen}
        children={<Comment />}
      />
    </>
  );

  return (
    <Tabs.Navigator
      screenOptions={{
        animation: "slide_from_bottom",
        contentStyle: { backgroundColor: theme.backgroundColor },
      }}
      initialRouteName="CharitiesDisplay"
    >
      <Tabs.Screen
        options={{ headerShown: false }}
        name="CharitiesDisplay"
        component={CharitiesDisplay}
      />
      <Tabs.Screen
        options={{
          title: "",
          headerShown: false,
          headerStyle: { backgroundColor: theme.navBg },
          headerTitleStyle: { color: theme.textColor, fontSize: 20 },
          headerTintColor: theme.textColor,
          headerLeft: () => (
            <Icon name="comment" size={24} color={theme.buttonPrimary} />
          ),

          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CharitiesDisplay");
                toggleNavbar();
              }}
            >
              <AntDesign
                name="arrowright"
                size={24}
                color={theme.buttonPrimary}
              />
            </TouchableOpacity>
          ),
        }}
        name="Comment"
        component={Comment}
      />
    </Tabs.Navigator>
  );
};

export default Charities;
