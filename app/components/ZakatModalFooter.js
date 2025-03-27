import {View} from 'react-native';
import React from 'react';
import {Button} from './ButtonWithLabel';

export default function ZakatModalFooter({
  closeModel,
  onPress,
  submitLabel = 'متابعة الدفع',
}) {
  return (
    <View
      style={{
        marginVertical: 20,
        flexDirection: 'row',
        width: 300,
      }}>
      <Button onPress={onPress} label={submitLabel} isActive />
      <Button onPress={closeModel} label="الغاء" />
    </View>
  );
}
