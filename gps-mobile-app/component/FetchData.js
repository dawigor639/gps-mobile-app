import React , { useState , useEffect, useCallback, useRef} from 'react';
import SmsAndroid from 'react-native-get-sms-android';
import {checkSmsPermissions} from './Permissions'; 

import { View, Dimensions , Text, ToastAndroid } from 'react-native'; //TESTS
import { useSelector, useDispatch} from 'react-redux';
import { edit, editRequests } from './ReduxDevices';

import { validateNumber, LATITUDE_REGEX, LONGITUDE_REGEX, RADIUS_REGEX, UNIX_TIME_REGEX, INTERVAL_REGEX } from './sharedValidation';
import {latitudeRange, longitudeRange, radiusRange, unixTimeRange, intervalRange, codeRange} from './sharedValues';


import { store } from './ReduxStore' // replace for useSelector



export default function FetchData() {


  const fetchInterval = 30; //sms api fetching interval in seconds

  const getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000)
  }

  //let devices = useSelector((state) => state.savedDevices);
  const getDevices = () => { // replace for useSelector
    const devices = store.getState().savedDevices;
    return devices; 
  }
  const dispatch = useDispatch();


  
  useEffect(() => {
    fetch();
    const interval = setInterval(() => fetch(), fetchInterval*1000);
    return () => clearInterval(interval);
  }, []);
  

  async function sendSms(phoneNumber, message) {
    return new Promise((resolve, reject) => {
      SmsAndroid.autoSend(
        phoneNumber,
        message,
        (fail) => {
          console.log('Failed with this error: ' + fail);
          reject(false); // Reject the promise with false if there was an error
        },
        (success) => {
          console.log('SMS sent successfully');
          resolve(true); // Resolve the promise with true if the SMS was sent successfully
        },
      );
    });
  }

  const generateRequestId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const random = Math.random().toString(36).slice(2, 7); // Generate a random string and take the first 5 characters
    const requestId = timestamp + '-' + random; // Combine the timestamp and random string
    return requestId;
  }


  const registerRequest = (elem,requestKey,status,requestId) => {
    //console.log('register newRequests',requestKey );
    dispatch(editRequests({[requestKey]: {requestId: requestId, requestTime: getTimestampInSeconds(), status: status}, id: elem.id}));
  }

  const unregisterRequest = (elem,requestKey,status) => {
    //console.log('unregister newRequests',requestKey );
    dispatch(editRequests({[requestKey]: { requestId: null, requestTime: null, status: status}, id: elem.id}));
  }
  
  const sendRequest = async (elem,requestKey,code) => {
    const requestPendingCode = 3;
    const smsErrorCode = 7;
    const requestId = generateRequestId();
    const smsSend = await sendSms(elem.address,elem.password+","+code+","+requestId); 
    if (smsSend) {
      registerRequest(elem,requestKey,requestPendingCode,requestId);
    } else {
      unregisterRequest(elem,requestKey,smsErrorCode)
    }
  }

  const handleRequests = (elem) => {
      console.log(elem.requests.position.status);
      //Handle position request if requestId is null
      if ( (elem.requests.position.status == 1) ) {
        sendRequest(elem,'position',0); // 0 is api get position request code 
      }
      //Handle sub/unsub request if requestId is and elem.circle.status = 1 or 2
      if ( (elem.requests.circle.status == 1 || elem.requests.circle.status == 2 )) {
        sendRequest(elem,'circle',elem.requests.circle.status); // 1/2 is api sub/unsub request code 
      }
  }

  const handleTimeouts = (elem) => {
    const timeoutErrorCode = 8;
    const maxTime = (elem.interval) + 300; //120 factory default cycle interval in s , 300 is max device processing time in cycle
    //Handle position request if requestId is null
    if ( elem.requests.position.requestTime && (elem.requests.position.requestTime < getTimestampInSeconds()-maxTime) ) {
      unregisterRequest(elem,'position',1) //setting 1 will allow sending position request again                     ///////////////////////
    }
    //Handle sub/unsub request if requestId is and elem.circle.status = 1 or 2
    if ( elem.requests.circle.requestTime && (elem.requests.circle.requestTime < getTimestampInSeconds()-maxTime) ) {
      unregisterRequest(elem,'circle',timeoutErrorCode);
    }
  }


  const updateDevice = (elem,payload) => {
    let newElements = {};
    if (elem.requests.circle.status != 1 && elem.requests.circle.status != 2 ) {
      newElements = {  
        position: {latitude: payload[0] ,longitude: payload[1], time: payload[2]}, 
        circle: {latitude: payload[3], longitude: payload[4], radius: payload[5]},
        interval: payload[6],
        id: elem.id
      } 
      unregisterRequest(elem,'circle', payload[5] ? 11 : 21 );
    }
    else {
      newElements = {  
        position: {latitude: payload[0] ,longitude: payload[1], time: payload[2]}, 
        interval: payload[6],
        id: elem.id
      } 
    }
    dispatch(edit(newElements));
  }

  const handleSms = (elem) => {

    handleRequests(elem);
    handleTimeouts(elem);

  }

  //sprintf(response, "resp=%d%.6f,%.6f,%d,%s,%d", requestTime, device->position[0], device->position[1],
  //(int)(device->unixTime), hasCircle ? circle : "0,0,0", device->interval);

  const matchRequestKey = (response, requests) => {

    const requestKey = Object.keys(requests).find((key) => {
      //const prefix = "resp=" + requests[key].requestId + ","; //////////////////////////////////////////////////TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
      const prefix = (key =='position') ?  "resp=" + "lh94r434-8tldu" + "," : "    ";
      if (response.startsWith(prefix)) {
        return true;
      }
      return false;
    });
    return requestKey;
  }

  const handleBody = (body,elem) => {  

    //Check if response is awaited by checking prefix
    const requestKey = matchRequestKey(body,elem.requests);  
    if (!requestKey)
      return false;


    console.log('requestKey: '       ,  requestKey);
    //Validate
    const textArray = body.substring( body.indexOf(',') + 1).split(",");
    if(textArray.length!=8 && textArray.length!=1) {
      unregisterRequest(elem,requestKey,9); //error code 9 
      return false; 
    }
    const paramsArray = [
      { type: "int", regex: /^(([0-9])|([1-9][0-9]))$/, ...codeRange},
      { type: "double", regex: LATITUDE_REGEX, ...latitudeRange },
      { type: "double", regex: LONGITUDE_REGEX, ...longitudeRange },
      { type: "int", regex: UNIX_TIME_REGEX, ...unixTimeRange},
      { type: "double", regex: LATITUDE_REGEX, ...latitudeRange },
      { type: "double", regex: LONGITUDE_REGEX, ...longitudeRange },
      { type: "int", regex: RADIUS_REGEX, min: 0, max: radiusRange.max},   
      { type: "int", regex: INTERVAL_REGEX, ...intervalRange},
    ]; 

      //console.log(textArray);

    const allValid = textArray.every((text, index) => {
      const { type, regex, min, max } = paramsArray[index];
      //console.log (text,validateNumber(text, type, regex, min, max));
      return validateNumber(text, type, regex, min, max);
    });

    //Valid response accepted 
    if (!allValid) {
      unregisterRequest(elem,requestKey,9); //error code 9
      return false; 
    }

    const numberArray = textArray.map((text, index) => {
      return paramsArray[index].type == "int" ? parseInt(text) : parseFloat(text);
    });

    const [code, ...payload] = numberArray;  // payload = [lat,lng,time,latSub,lngSub,radSub,interval];

    //Update state (based on code)
    switch (code) {
      case 1:
        updateDevice(elem,payload);
        unregisterRequest(elem,requestKey,code);
        break;
      case 11:
      case 21:
      case 10:   
      case 12: 
      case 20:
        unregisterRequest(elem,requestKey,code);
        break;
      default:
        unregisterRequest(elem,requestKey,9); //error code 9
        return false; 
          

    }
    
  }

  const handleMessage = (elem,message) => {
    //console.log("message:",message);
    handleBody(message.body,elem);
    deleteMessageById(message._id);
  }

  const deleteMessageById = (id) => {/*
    SmsAndroid.delete(
      id,
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (success) => {
        console.log(success);
      },
    );*/
  }

  const deleteSentMessages = () => {/*
    let filter = {
      box: 'sent', 
      address: elem.address
    };
      SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('error handler here' + fail);
      },
      (count, smsList) => {
        if (count>0) {
          let smsArray = JSON.parse(smsList);
          smsArray.forEach(elem => deleteMessageById(elem._id));
        }
      }
    );*/

  };

  function getMessages(elem) {
    let filter = {
      address: elem.address, 
      bodyRegex: 'resp=(.*)'  
    };
      SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('error handler here' + fail); //Todo
      },
      (count, smsList) => {
        if (count>0) {
        let smsArray = JSON.parse(smsList);  
        //console.log("smsArray:",smsArray);
        smsArray.forEach(message => handleMessage(elem,message))
        }
      }
    );
    }

  const handleMessages = (elem) => {
     getMessages(elem);
     deleteSentMessages();
     handleSms(elem);
  }

  function fetch() {
    handlePermissions().then( resp => {
      if (resp) { 

        const devices = store.getState().savedDevices;
        //getDevices().then( devices => {devices.forEach(elem => handleMessages(elem))} );//
        if (devices[0]) console.log('devices2',devices[0].requests);
        //console.log('devices2',devices);
        devices.forEach(elem => handleMessages(elem));
      }
    })
    
  }    

  const handlePermissions = async () => {
      
    const sms = await checkSmsPermissions();
    if (sms) {
    //console.log(sms,storage)
      return true}
    else 
      return false
  }


return (null);
//return (<View>{savedDevices[0].address!=undefined&&<Text>{savedDevices[0].name}</Text>}</View>); //test
//return (<View>{devices[0]?.name!=undefined&&<Text>{devices[0].name}</Text>}</View>); //test

}