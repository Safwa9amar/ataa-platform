import { View } from "react-native";
import React, { useEffect } from "react";
import Markdown from "react-native-markdown-display";
import { useTheme } from "../context/ThemeContext";

export default function MyMarkDown({ children , styles}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: theme.backgroundColor,
        // borderColor: theme.borderColor,
        // borderWidth: 1,
        justifyContent: "flex-start",
      }}
    >
      <Markdown
        style={{
          body: {
            alignItems: "flex-end",
          },
          text: {
            color: theme.textColor,
            fontFamily: "ElMessiri",
          },
          blockquote: {
            backgroundColor: theme.backgroundColor,
            borderLeftColor: theme.primaryColor,
          },
          list_item: {
            textAlign: "right",
            flexDirection: "row-reverse",
            alignSelf: "flex-start",
          },
          image : {
            alignSelf: "center",
          },
        }}
      >
        {children}
      </Markdown>
    </View>
  );
}
