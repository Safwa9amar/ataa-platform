// 1. React and React Native Imports
import React, { useEffect, useRef } from "react";
import {
  DrawerLayoutAndroid,
  I18nManager,
  LogBox,
  Platform,
  Text,
} from "react-native";
// 2. Third-Party Libraries
import { NavigationContainer } from "@react-navigation/native";

// 3. Custom Hooks
import { useAppContext } from "./context/AppContext";
import { useTheme } from "./context/ThemeContext";

// 4. Context Providers
import { NavbarVisibilityProvider } from "./context/NavbarVisibilityContext";
import {
  CredentialsProvider,
  useCredentials,
} from "./context/CredentialsContext";
import { DrawerProvider } from "./context/DrawerContext";
import { ModelProvider } from "./context/ModelContext";
import { CartProvider } from "./context/CartContext";

// 5. Components
import DrawerContent from "./components/Drawer";
import AppLoader from "./components/AppLoader";
import ErrorBoundary from "./components/ErrorBoundary";

// 6. Navigators
import StackNavigator from "./navigation/StackNavigator";
import TabsNavigator from "./navigation/TabsNavigator";
import { DonationModalProvider } from "./context/DonationModalContext";
import { SavedDonationOpportunitiesProvider } from "./context/SavedDonationOpportunitiesContext";
import { NotificationProvider } from "./context/NotificationContext";
// 7. Utilities and Helpers
// (No utilities and helpers in this example, but keep this section for future use)

// 8. Styles and Constants
// (No styles and constants in this example, but keep this section for future use)

// 9. Assets (Images, Fonts, Data, etc.)
// (No assets in this example, but keep this section for future use)
const App = () => {
  const drawer = useRef(null);
  const { theme } = useTheme();
  const navigationView = () => <DrawerContent />;
  const { appIsReady } = useAppContext();
  LogBox.ignoreAllLogs();

  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <CredentialsProvider>
        <ErrorBoundary>
          <NotificationProvider>
            <NavbarVisibilityProvider>
              <SavedDonationOpportunitiesProvider>
                <ModelProvider>
                  <DrawerProvider drawer={drawer}>
                    <DrawerLayoutAndroid
                      drawerWidth={300}
                      ref={drawer}
                      drawerBackgroundColor={theme.backgroundColor}
                      drawerPosition={"right"}
                      renderNavigationView={navigationView}
                    >
                      {!appIsReady && <AppLoader />}
                      <CartProvider>
                        <DonationModalProvider>
                          <StackNavigator drawer={drawer} />
                        </DonationModalProvider>
                      </CartProvider>
                      <TabsNavigator />
                    </DrawerLayoutAndroid>
                  </DrawerProvider>
                </ModelProvider>
              </SavedDonationOpportunitiesProvider>
            </NavbarVisibilityProvider>
          </NotificationProvider>
        </ErrorBoundary>
      </CredentialsProvider>
    </NavigationContainer>
  );
};

export default App;
