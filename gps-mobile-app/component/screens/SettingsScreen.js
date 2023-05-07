import React from 'react';
import {TouchableWithoutFeedback, SafeAreaView, StatusBar, Keyboard} from 'react-native';
import Settings from '../../component/Settings'

export default function SettingsScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle='dark-content'/> 
            <Settings/>
        </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}