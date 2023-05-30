import React from 'react';
import { TouchableWithoutFeedback, SafeAreaView, StatusBar, Keyboard } from 'react-native';
import Map from '../../component/Map'

export default function HomeScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle='dark-content' />
        <Map />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}