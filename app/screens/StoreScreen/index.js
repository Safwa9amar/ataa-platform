import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Shop from "./Shop";
import StoreDonationOpportunities from "./StoreDonationOpportunities";
import { useTheme } from "../../context/ThemeContext";
import { StoreProvider } from "../../context/StoreContext";

const Tabs = createNativeStackNavigator();
export default function StoreScreen({ navigation, route }) {
  const theme = useTheme();
  return (
    <StoreProvider>
      <Tabs.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: theme.backgroundColor },
          headerShown: false,
          animation: "fade",
        }}
      >
        <Tabs.Screen
          name="StoreDonationOpportunities"
          component={StoreDonationOpportunities}
        />
        <Tabs.Screen name="Shop" component={Shop} />
      </Tabs.Navigator>
    </StoreProvider>
  );
}
