import React from 'react';
import { TouchableWithoutFeedback, SafeAreaView, StatusBar, Keyboard } from 'react-native';
import History from '../../component/History'

export default function HistoryScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle='dark-content' />
        <History />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}