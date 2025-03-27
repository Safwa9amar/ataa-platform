import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ScrollToTopButton = ({scrollViewRef}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = ({nativeEvent}) => {
      const {contentOffset, contentSize, layoutMeasurement} = nativeEvent;
      const distanceToBottom =
        contentSize.height - contentOffset.y - layoutMeasurement.height;
      setShowButton(distanceToBottom > 500); // Show button when distance to bottom is greater than 500
    };

    const scrollRef = scrollViewRef.current;
    if (scrollRef) {
      scrollRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handlePress = () => {
    const scrollRef = scrollViewRef.current;
    if (scrollRef) {
      scrollRef.scrollTo({y: 0, animated: true});
    }
  };

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {opacity: showButton ? 1 : 0}]}
      onPress={handlePress}>
      <Ionicons name="arrow-up-circle" size={32} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 10,
  },
});
export default ScrollToTopButton;
