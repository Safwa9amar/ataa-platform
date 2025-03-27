import React, { useCallback } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Share,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../context/ThemeContext";
import Text from "../../../../components/Text";
import Icon from "react-native-vector-icons/FontAwesome";
import API_ENDPOINTS from "../../../../config/config";
import { useCredentials } from "../../../../context/CredentialsContext";
import { addLike, deleteLike } from "../../../../services/likeService";

const CharityCard = ({
  image,
  name,
  country,
  description,
  shareCount,
  comments,
  likes,
  id,
  showModel,
}) => {
  const { user, userToken, isLoggedIn } = useCredentials();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [likesLength, setLikesLength] = React.useState(likes.length);
  const [isLiked, setIsLiked] = React.useState(
    likes.find((like) => like.createdByUserId === user.id)
  );

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: name + " " + description,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLike = useCallback(async () => {
    let like = likes.find((like) => like.createdByUserId === user.id);
    if (!isLoggedIn) {
      ToastAndroid.show("يجب تسجيل الدخول", ToastAndroid.SHORT);
      return;
    }
    if (!isLiked) {
      setIsLiked(true);
      let like = addLike(id, userToken);
      if (like) {
        setLikesLength(likesLength + 1);
      }
    } else {
      setIsLiked(false);
      let unlike = deleteLike(like.id, userToken);
      if (unlike) {
        setLikesLength(likesLength - 1);
      }
    }
    // console.log("like pressed",likesLength );
  }, [isLiked]);

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.mangoBlack }]}>
      <Image
        style={styles.image}
        source={{ uri: `${API_ENDPOINTS.UPLOADS}/${image}` }}
      />
      <View style={styles.textContainer}>
        <Text
          style={{
            fontWeight: "bold",
          }}
          type="bodyTextSmall"
        >
          {name}
        </Text>
        <Text type="bodyTextSmall">{description}</Text>
        <Text type="bodyTextSmall"> {country}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => {
            handleShare();
          }}
        >
          <IconWithText text={shareCount} iconName="share-square" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            showModel();
            navigation.setParams({
              charityId: id,
            });
          }}
        >
          <IconWithText
            text={comments ? comments.length : 0}
            iconName={"comments-o"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLike}>
          <IconWithText
            color={isLiked ? theme.BONKER_PINK : theme.steel}
            text={likesLength}
            iconName={isLiked ? "heart" : "heart-o"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const IconWithText = ({ text, iconName, color }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.iconTextContainer}>
      <Text type="bodyTextSmall">{text}</Text>
      <Icon name={iconName} size={24} color={color || theme.steel} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 450,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  image: {
    height: 250,
    width: "100%",
    marginBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
    paddingTop: 20,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default CharityCard;
