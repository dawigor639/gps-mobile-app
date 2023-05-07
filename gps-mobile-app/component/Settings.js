import React , {useState , useEffect } from 'react'
import {Text, View , ToastAndroid, Keyboard, Switch} from 'react-native'
import { settingsStyles} from './Styles'

import SmsAndroid from 'react-native-get-sms-android';


export default function SettingsScreen() {

const [back,setBack] = useState(false);

  useEffect(() => {
    if (back) {
      console.log("back")
    }
  }, [back]);
  
const [isEnabled, setIsEnabled] = useState(false);
const toggleSwitch = async () => {
  setIsEnabled(!isEnabled);
    /*if (!isEnabled) {
      console.log("start");
      BackgroundTimer.start(5000);
     } else if (isEnabled) {
      console.log("stop");
      BackgroundTimer.stop(); //after this call all code on background stop run.
     }  */
};

  return (
 
    <View style={settingsStyles.container}>
        
      <Text style={settingsStyles.title} > Settings </Text>

      <View style={settingsStyles.button}>
        <Switch style={{ marginRight: 200, transform: [{ scaleX: 2 }, { scaleY: 2 }]}}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}/>
      </View>

    </View>
    )
  }
