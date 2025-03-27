import React, {useState} from 'react';
import {Modal, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import Text from './Text';

const CustomAlert = ({
  visible,
  title = null,
  message = null,
  buttons = [],
  onCancel,
  icon,
}) => {
  if (!visible) {
    return null; // Render nothing if not visible
  }
  const {theme} = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel} // Handle Android back button press
    >
      <View style={styles.container}>
        <View style={styles.alertContainer(theme.mangoBlack)}>
          {icon}
          {/* <Image source={require('./path-to-your-image.png')} style={styles.icon} /> */}
          {title && (
            <Text type="lg" style={styles.title}>
              {title}
            </Text>
          )}
          {message && (
            <Text type="md" style={styles.message}>
              {message}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  index === 0
                    ? styles.confirmButton(theme.primaryColorDark)
                    : styles.cancelButton(theme.steel),
                ]}
                onPress={() => {
                  button.onPress();
                  onCancel();
                }}>
                <Text type="sm" style={styles.buttonText}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Custom hook to manage alert state
export const useAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    buttons: [],
    onCancel: () => setIsVisible(false),
  });

  const showAlert = (title, message, buttons, icon) => {
    setAlertConfig({
      title,
      message,
      buttons,
      onCancel: () => setIsVisible(false),
      icon,
    });
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  return {
    showAlert,
    hideAlert,
    CustomAlert: () => (
      <CustomAlert
        icon={alertConfig.icon}
        visible={isVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onCancel={alertConfig.onCancel}
      />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: bgColor => ({
    backgroundColor: bgColor || '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  }),

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: bgColor => ({
    backgroundColor: bgColor || '#6C757D',
  }),
  confirmButton: bgColor => ({
    backgroundColor: bgColor || '#007BFF',
  }),

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});
