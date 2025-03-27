import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Text from "../components/Text";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import { useNotifications } from "../context/NotificationContext";
import Icon from "../components/Icon";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useCredentials } from "../context/CredentialsContext";
import { useTheme } from "../context/ThemeContext";

export default function Notifications() {
  const { setHideNavbar } = useHideNavbar();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={markAllAsRead}>
          <Icon.MaterialIcons
            name="mark-email-read"
            size={24}
            color="#09D9C6"
          />
        </TouchableOpacity>
      ),
    });
    return () => setHideNavbar(false);
  }, []);

  const handleSearch = (text) => {
    fetchNotifications(text);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem(theme.mangoBlack, theme.borderColor),
        item.read && styles.readNotification,
      ]}
      onPress={() => {
        if (!item.read) markAsRead(item.id);
        if (item.link) navigation.navigate(item.link);
      }}
    >
      <View style={styles.notificationContent}>
        <Text type="md" style={styles.notificationTitle(theme.textColor)}>
          {item.title}
        </Text>
        <Text type="sm" style={styles.notificationMessage}>
          {item.message}
        </Text>
        <Text type="xs" style={styles.notificationTime}>
          {formatDistanceToNow(new Date(item.createdAt), {
            addSuffix: true,
            locale: ar,
          })}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar fetchDataCallback={handleSearch} width="90%" align="center" />

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchNotifications}
              colors={["#09D9C6"]}
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            style={styles.emptyImage}
            source={require("../assets/images/notific-ring.png")}
          />
          <Text type="md" style={styles.emptyText}>
            لا توجد اشعارات حاليا
          </Text>
          <Text type="md" style={styles.emptyText}>
            سيتم عرض الاشعارات هنا
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: (bgColor, borderColor) => ({
    backgroundColor: bgColor,
    border: borderColor,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),
  readNotification: {
    opacity: 0.7,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: (color) => ({
    fontWeight: "bold",
    color: color,
    marginBottom: 4,
  }),
  notificationMessage: {
    color: "#666",
    marginBottom: 4,
  },
  notificationTime: {
    color: "#999",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#09D9C6",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    color: "#666",
    marginVertical: 4,
  },
});
