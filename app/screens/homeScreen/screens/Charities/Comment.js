import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "../../../../context/ThemeContext";
import Text from "../../../../components/Text";
import ScreensContainer from "../../../../components/ScreensContainer";
import AddComment from "./AddComment";
import UserCommentSkeleton from "../../../../components/skeleton/UserCommentSkeleton";
import { useCredentials } from "../../../../context/CredentialsContext";
import {
  createComment,
  getAllCommentsByCharityId,
} from "../../../../services/commentService";
import API_ENDPOINTS from "../../../../config/config";
import useElapsedTime from "../../../../hooks/useElapsedTime";
import { useRoute } from "@react-navigation/native";

const Comment = () => {
  const route = useRoute();
  const { charityId } = route.params;
  const { userToken, user } = useCredentials();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  let getComments = async () => {
    try {
      const comments = await getAllCommentsByCharityId(charityId, userToken);
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    getComments();
  }, [charityId]);

  const handleAddComment = async (newComment) => {
    setLoading(true);
    let comment = await createComment(
      {
        text: newComment,
        charityId,
        createdByUserId: user.id,
      },
      userToken
    );
    if (comment) {
      getComments();
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      keyboardVerticalOffset={120}
    >
      <FlatList
        contentContainerStyle={styles.container}
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <UserComment comment={item} />}
        ListEmptyComponent={
          loading && (
            <>
              <UserCommentSkeleton />
              <UserCommentSkeleton />
              <UserCommentSkeleton />
            </>
          )
        }
      />
      <AddComment loading={loading} onAddComment={handleAddComment} />
    </KeyboardAvoidingView>
  );
};

const UserComment = ({ comment }) => {
  const { theme } = useTheme();
  const { customText } = useElapsedTime(comment.createdAt);

  return (
    <View
      style={[styles.commentContainer, { backgroundColor: theme.mangoBlack }]}
    >
      <Image
        style={styles.image}
        source={{
          uri: `${API_ENDPOINTS.UPLOADS}/${comment.createdByUser?.photo}`,
        }}
      />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text type="sm">({customText})</Text>
          <Text type="md">{comment.createdByUser?.name}</Text>
        </View>
        <Text type="sm" style={styles.commentText}>
          {comment.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
    overflow: "visible",
  },
  commentContainer: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    marginVertical: 10,
  },
  image: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  commentText: {
    textAlign: "right",
    paddingVertical: 5,
  },
  footer: {},
});

export default Comment;
