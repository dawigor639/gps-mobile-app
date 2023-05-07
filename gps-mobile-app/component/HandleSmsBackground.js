import SmsAndroid from 'react-native-get-sms-android';
import { Alert } from 'react-native'; ///TEST

//export default async function HandleSmsBackground() {
export default HandleSmsBackground = async (data) => {
    SmsAndroid.autoSend(
        "+48514963155",
        "OK",
        (fail) => {
          console.log('Failed with this error: ' + fail);
        },
        (success) => {
          console.log('SMS sent successfully');
        },
      );
    console.log("Background task");
    Alert.alert("Background task")
 }
