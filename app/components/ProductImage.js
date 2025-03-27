import React, {useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';

const ProductImage = ({imageUri, productID}) => {
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    imageUri == null && setImageError(true);
  }, []);
  return (
    <Animated.Image
      sharedTransitionTag={productID.toString()}
      source={
        imageError
          ? require(process.env.PRODUCT_IMAGE_PLACHOLDER) // Ensure you have the correct path to your local image
          : {uri: imageUri}
      }
      style={styles.productImage}
      onError={(e) => setImageError(true)}
    />
  );
};

const styles = StyleSheet.create({
  productImage: {
    backgroundColor: '#fff',
    width: '100%',
    height: 350,
    resizeMode: 'contain',
  },
});

export default ProductImage;
