import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "../services/getCommonHeaders";
import Icon from "./Icon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isReloading: false };
    this.logErrorToServer = this.logErrorToServer.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  logErrorToServer = async (error, additionalInfo = {}) => {
    try {
      await fetch(API_ENDPOINTS.LOG_ERRORS.LOG, {
        method: "POST",
        headers: getCommonHeaders(),
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          additionalInfo,
        }),
      });
      console.log("Error sent to server");
    } catch (networkError) {
      console.error("Failed to send error to server:", networkError);
    }
  };

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.logErrorToServer(error, info && info.componentStack);
  }

  handleReload = () => {
    this.setState({ isReloading: true });
    setTimeout(() => {
      this.setState({ hasError: false, isReloading: false });
    }, 1000); // Simulate a reload delay
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Image
            source={require("../assets/logo/fullLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.message}>
            عذرًا! حدث خطأ ما.{"\n"}
            لا تقلق، نحن نعمل على إصلاحه. حاول إعادة تحميل التطبيق.{"\n\n"}
            <Text style={styles.subMessage}>
              إذا استمرت المشكلة، لا تتردد في التواصل معنا.
            </Text>
          </Text>
          <TouchableOpacity
            onPress={this.handleReload}
            style={styles.button}
            disabled={this.state.isReloading}
          >
            {this.state.isReloading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon.AntDesign name="reload1" size={20} color="#fff" />
                <Text style={styles.buttonText}> إعادة المحاولة</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /* افتح رابط الدعم */
            }}
            style={styles.supportLink}
          >
            <Text style={styles.supportLinkText}>تواصل معنا</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 28,
  },
  subMessage: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  supportLink: {
    marginTop: 10,
  },
  supportLinkText: {
    color: "#007BFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default ErrorBoundary;