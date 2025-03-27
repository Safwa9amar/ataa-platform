const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./index.web.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    alias: {
      "react-native$": "react-native-web",
    },
    extensions: [".web.js", ".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      process: require.resolve("process/browser"),
      // Add other fallbacks here if needed (e.g., "buffer": require.resolve("buffer/"))
    },
  },
  module: {
    rules: [
      // JavaScript, JSX, TypeScript, and TSX files
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        exclude: /node_modules\/(react-native-linear-gradient)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript", // For TypeScript
              "@babel/preset-flow", // For Flow (if needed)
            ],
          },
        },
      },
      // CSS files
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // Asset files (images, fonts, etc.)
      {
        test: /\.(png|jpe?g|gif|svg|ico|woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^expo-constants$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^react-native-document-picker$/,
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
      process: {
        env: { WEB_CLIENT_ID: JSON.stringify(process.env.WEB_CLIENT_ID) },
      },
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    hot: true,
  },
};
