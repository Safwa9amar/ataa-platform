module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      // "@babel/preset-env", // Necessary for web compatibility
      // "@babel/preset-react", // Necessary for React support
      // "@react-native/babel-preset",
      // "@babel/preset-flow", // Add this for Flow
      // "@babel/preset-typescript", // Add this for TypeScript
      


      "module:metro-react-native-babel-preset", // Necessary for React Native
    ],
    plugins: [
      "react-native-reanimated/plugin", // Required for react-native-reanimated
      [
        "module:react-native-dotenv", // For environment variables
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          allowUndefined: true, // Allow undefined environment variables
          verbose: false, // Set to true if you want detailed logs
        },
      ],
    ],
  };
};
