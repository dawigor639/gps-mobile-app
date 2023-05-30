import React from 'react';
import { TouchableWithoutFeedback, SafeAreaView, StatusBar, Keyboard } from 'react-native';
import Devices from '../../component/Devices'

export default function DetailsScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle='dark-content' />
        <Devices />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}