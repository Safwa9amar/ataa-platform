import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import DefaultSkeletonLoader from '../skeleton/DefaultSkeletonLoader';

const BloodDonationCardSkeleton = ({ width = Dimensions.get('window').width - 20 }) => {
  return (
    <View style={[styles.container, { width }]}>
      <DefaultSkeletonLoader width="100%" height={300} style={styles.imageSkeleton} />
      <View style={styles.overlaySkeletonContainer}>
        <DefaultSkeletonLoader width={40} height={40} style={styles.iconSkeleton} />
        <DefaultSkeletonLoader width={40} height={40} style={styles.iconSkeleton} />
      </View>
      <DefaultSkeletonLoader width={100} height={50} style={styles.bloodTypeSkeleton} />
      <View style={styles.donateSkeletonContainer}>
        <DefaultSkeletonLoader width={150} height={40} style={styles.donateButtonSkeleton} />
      </View>
      <View style={styles.contentSkeletonContainer}>
        <DefaultSkeletonLoader width={300} height={10} style={styles.progressBarSkeleton} />
        <DefaultSkeletonLoader width="70%" height={20} style={styles.titleSkeleton} />
        <DefaultSkeletonLoader width="60%" height={20} style={styles.textSkeleton} />
        <DefaultSkeletonLoader width="60%" height={20} style={styles.textSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageSkeleton: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  overlaySkeletonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  iconSkeleton: {
    borderRadius: 20,
  },
  bloodTypeSkeleton: {
    position: 'absolute',
    top: 125,
    alignSelf: 'center',
    borderRadius: 10,
  },
  donateSkeletonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#e0e0e0',
  },
  donateButtonSkeleton: {
    borderRadius: 10,
  },
  contentSkeletonContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    gap: 10,
  },
  progressBarSkeleton: {
    alignSelf: 'center',
  },
  titleSkeleton: {
    marginTop: 10,
  },
  textSkeleton: {
    marginTop: 5,
  },
});

export default BloodDonationCardSkeleton;
