import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import Icon from "../../../../components/Icon";
import { useCredentials } from "../../../../context/CredentialsContext";
import AlertMessage from "../../../../components/AlertMessage";
import { useNavigation } from "@react-navigation/native";

export default function AddComment({ onAddComment, loading }) {
  const { theme } = useTheme();
  const { isLoggedIn } = useCredentials();
  const [comment, setComment] = useState("");
  const navigation = useNavigation();

  const inputRef = useRef();

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      onAddComment(comment);
      setComment("");
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      inputRef.current.focus();
    }
  }, [isLoggedIn]);
  return (
    <View style={[styles.container(theme.mangoBlack), {}]}>
      {!isLoggedIn && (
        <AlertMessage
          message="يجب تسجيل الدخول لتتمكن من التعليق"
          type="info"
          onConfirm={() => {
            navigation.navigate("Login", {
              screen: "LoginForm",
            });
          }}
        />
      )}
      <TextInput
        editable={isLoggedIn}
        style={[styles.input, { color: theme.textColor }]}
        placeholder="اكتب تعليقك هنا..."
        placeholderTextColor={theme.placeholderTextColor}
        ref={inputRef}
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity
        onPress={() => {
          handleAddComment();
        }}
        style={styles.sendIcon}
      >
        <Icon.MaterialCommunityIcons
          name="send-circle"
          size={32}
          color={theme.primaryColor}
        />
        {loading && (
          <ActivityIndicator
            animating={loading}
            color={theme.buttonPrimary}
            size="small"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: (bg) => ({
    width: "100%",
    backgroundColor: bg,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  }),
  sendIcon: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    left: 5,
    bottom: 5,
  },
  input: {
    flex: 1,
    width: "100%",
    marginRight: 10,
    padding: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    textAlign: "right",
  },
});
