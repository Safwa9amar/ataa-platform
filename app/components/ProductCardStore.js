import React, {useEffect, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import Text from './Text';
import {Easing} from 'react-native-reanimated';
import ReAnimated from 'react-native-reanimated';
export const ProductCardStoreSkeletonLoader = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 500,
          easing: Easing.inOut(Easing.ease),

          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),

          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={[styles.skeletonImage, {opacity: pulseAnim}]} />
      <View style={styles.skeletonTextContainer}>
        <Animated.View style={[styles.skeletonText, {opacity: pulseAnim}]} />
        <Animated.View style={[styles.skeletonText, {opacity: pulseAnim}]} />
      </View>
    </View>
  );
};

const StoreCard = ({id, title, price, image, handlePress}) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <ReAnimated.Image
        sharedTransitionTag={id.toString()}
        style={[
          styles.cardImage,
          {borderColor: theme.borderColor, backgroundColor: theme.mangoBlack},
        ]}
        source={{uri: image}}
      />
      <View style={styles.cardTextContainer}>
        <Text type="sm">{title}</Text>
        <Text color={theme.secondaryColor} style={styles.boldText} type="sm">
          {price} دج
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    height: 250,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    objectFit: 'contain',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: 170,
  },
  cardTextContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  // Skeleton styles
  skeletonCard: {
    borderRadius: 10,
    backgroundColor: '#eee',
    width: 150,

  },
  skeletonImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  skeletonTextContainer: {
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  skeletonText: {
    height: 20,
    backgroundColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default StoreCard;
