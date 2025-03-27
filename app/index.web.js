/**
 * @format
 */

import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import WebApp from "./web/WebApp";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

let AppWithTheme = () => (
  <AppProvider>
    <ThemeProvider>
      <WebApp />
    </ThemeProvider>
  </AppProvider>
);

AppRegistry.registerComponent(appName, () => AppWithTheme);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("app-root"),
});
