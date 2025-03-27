import React from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '../../context/ThemeContext';
import bloodTypeHolder from '../../assets/images/bloodTypeHolder.png';
import Text from '../Text';
import Icon from '../Icon';

const BloodDonationCard = ({
  BloodType,
  title,
  remainingAmount,
  donatedUnits,
  onPress,
  progress,
  width = Dimensions.get('window').width - 20,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { width, borderColor: theme.borderColor }]}>
      <ImageBackground
        style={[styles.imageBackground, { backgroundColor: theme.mangoBlack }]}
        source={bloodTypeHolder}
        resizeMode="cover"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
      >
        <View style={styles.overlay}>
          <Icon.Feather name="bookmark" size={22} color="white" />
          <Icon.Feather name="share-2" size={22} color="white" />
        </View>
        <View style={styles.bloodTypeContainer}>
          <Text style={styles.bloodTypeText}>{BloodType}</Text>
        </View>
      </ImageBackground>
      <View style={[styles.donateContainer, { backgroundColor: theme.mangoBlack }]}>
        <TouchableOpacity onPress={onPress} style={styles.donateButton}>
          <Text type="sm" style={styles.donateButtonText}>ساهم بانقاذ حياة</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.contentContainer, { backgroundColor: theme.backgroundColor }]}>
        <Progress.Bar
          style={styles.progressBar}
          animated
          progress={progress}
          width={300}
          height={10}
          color={progress < 0.5 ? 'red' : 'green'}
        />
        <Text type="md">{title}</Text>
        <Text type="sm">عدد الوحدات المستهدفة: {remainingAmount}</Text>
        <Text type="sm">عدد الوحدات المتبرع بها: {donatedUnits}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
  },
  imageBackground: {
    height: 300,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    backgroundColor: '#00000050',
    borderRadius: 10,
  },
  bloodTypeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    fontSize: 90,
    fontWeight: 'bold',
    color: '#B80202',
  },
  donateContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  donateButton: {
    alignSelf: 'center',
    backgroundColor: '#790850',
    padding: 10,
    borderRadius: 10,
  },
  donateButtonText: {
    color: 'white',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'space-between',
    gap: 10,
  },
  progressBar: {
    alignSelf: 'center',
  },
});

export default BloodDonationCard;
