import React, { useEffect } from 'react';
import SmsAndroid from 'react-native-get-sms-android';
import { checkSmsPermissions } from './Permissions';

import { useDispatch } from 'react-redux';
import { edit, editRequests } from './ReduxDevices';
import { addRecord } from './ReduxDatabase'

import { validateNumber, LATITUDE_REGEX, LONGITUDE_REGEX, RADIUS_REGEX, UNIX_TIME_REGEX, INTERVAL_REGEX } from './sharedValidation';
import { latitudeRange, longitudeRange, radiusRange, unixTimeRange, intervalRange, codeRange, LATITUDE_DEFAULT, LONGITUDE_DEFAULT } from './sharedValues';

import { store } from './ReduxStore' // replace for useSelector

/**
 * This function fetches data from an SMS API at a specified interval, handles requests and timeouts,
 * updates device state based on received responses, and updates a database with received messages.
 * @function FetchData
 * @returns {null} 
 */
export default function FetchData() {

  /** Interval in seconds, it is used for fetching data from an SMS API.
   * @memberof FetchData
   * @instance    
   */
  const fetchInterval = 30;

  /**
   * The function returns the current timestamp in seconds
   * @returns Returns the current timestamp in seconds as a whole number (integer)
   * @memberof FetchData
   * @instance    
   */
  const getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000)
  }

  /** Dispatch actions to update the state of the Redux store
   * @memberof FetchData
   * @instance    
   */
  const dispatch = useDispatch();

  /* React hook that is used to fetch data from an SMS API at a specified interval */
  useEffect(() => {
    fetch();
    const interval = setInterval(() => fetch(), fetchInterval * 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * The function generates a unique request ID by combining the current timestamp and a random string.
   * @returns Returns a string that combines the current timestamp and a random string
   * @memberof FetchData
   * @instance    
   */
  const generateRequestId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const random = Math.random().toString(36).slice(2, 7); // Generate a random string and take the first 5 characters
    const requestId = timestamp + '-' + random; // Combine the timestamp and random string
    return requestId;
  }

  /**
   * This function registers a new request by updating its id, time and status
   * @param elem - Object containing information about single device
   * @param requestKey - Unique identifier for the request being registered.
   * @param status - Current status of a request
   * @param requestId - Unique identifier for a specific request
   * @memberof FetchData
   * @instance    
   */
  const registerRequest = (elem, requestKey, status, requestId) => {
    //console.log('register newRequests',requestKey );
    dispatch(editRequests({ requestKey: requestKey, requestId: requestId, requestTime: getTimestampInSeconds(), status: status, id: elem.id }));
  }

  /**
   * This function unregisters a request by updating its status, id and time
   * @param elem - Object containing information about single device
   * @param requestKey - Unique identifier for the request being registered
   * @param status - Current status of a request
   * @memberof FetchData
   * @instance    
   */
  const unregisterRequest = (elem, requestKey, status) => {
    //console.log('unregister newRequests',requestKey );
    dispatch(editRequests({ requestKey: requestKey, requestId: null, requestTime: getTimestampInSeconds(), status: status, id: elem.id })); 
  }

  /**
   * This function sends an SMS message with a specific payload to a phone number and registers a
   * new request on success
   * @param elem - It is an object that contains information about the recipient of the SMS message,
   * including their phone number and password.
   * @param requestKey - It is a key used to identify the type of request
   * @param code - Represents a code that will be sent in the SMS message
   * @param payload - An optional parameter that can be used to pass additional data along with the
   * SMS message. It is an empty string by default
   * @memberof FetchData
   * @instance    
   */
  const sendRequest = async (elem, requestKey, code, payload = "") => {
    const requestPendingCode = 3;
    const smsErrorCode = 7;
    const requestId = generateRequestId();
    const phoneNumber = elem.address;
    const message = elem.password + "," + code + "," + requestId + payload;
    //console.log("Begin sending SMS");
    SmsAndroid.autoSend(
      phoneNumber,
      message,
      (fail) => {
        console.log('Failed with this error: ' + fail);
        unregisterRequest(elem, requestKey, smsErrorCode)
      },
      (success) => {
        console.log('SMS sent successfully');
        registerRequest(elem, requestKey, requestPendingCode, requestId);
      },
    );
  }

  /**
   * The function handles position and subscription/unsubscription requests for a given element
   * @param elem - Object containing information about single device
   * @memberof FetchData
   * @instance    
   */
  const handleRequests = (elem) => {
    //console.log(elem.requests.position.status);
    //Handle position request 
    if ((elem.requests.position.status == 1)) {
      sendRequest(elem, 'position', 0); // 0 is api get position request code 
    }
    //Handle sub/unsub request if requestId is and elem.circle.status = 1 or 2
    if ((elem.requests.circle.status == 1)) {
      const payload = "," + [elem.circle.latitude, elem.circle.longitude, elem.circle.radius].join(',');
      sendRequest(elem, 'circle', elem.requests.circle.status, payload);
    }
    if ((elem.requests.circle.status == 2)) {
      sendRequest(elem, 'circle', elem.requests.circle.status);
    }

  }

  /**
   * The function handles timeouts for position and sub/unsub requests in an element.
   * @param elem - Object containing information about single device
   * @memberof FetchData
   * @instance    
   */
  const handleTimeouts = (elem) => {
    const maxTime = (elem.interval) + 300; //120 factory default cycle interval in s , 300 max processing time in cycle
    const smsFailTimeout = 120; // wait this time before sending SMS if SMS sending fails
    const requestPendingCode = 3;
    const smsErrorCode = 7;
    const timeoutErrorCode = 8;

    // Handle position request sending (sms send fail timeout)
    if ( elem.requests.position.requestTime && (elem.requests.position.status == smsErrorCode) && (elem.requests.position.requestTime < getTimestampInSeconds() - smsFailTimeout)) {  
      unregisterRequest(elem, 'position', 1) //setting 1 will allow sending position request again                     
    }
    // Handle position request (no response timeout)
    if ( elem.requests.position.requestTime && (elem.requests.position.status == requestPendingCode) && (elem.requests.position.requestTime < getTimestampInSeconds() - maxTime)) {  
      unregisterRequest(elem, 'position', 1) //setting 1 will allow sending position request again                     
    }
    // Handle sub/unsub request (elem.requests.circle.status = 1 or 2) (no response timeout)
    if ( elem.requests.circle.requestTime && (elem.requests.circle.status == requestPendingCode) && (elem.requests.circle.requestTime < getTimestampInSeconds() - maxTime)) {
      unregisterRequest(elem, 'circle', timeoutErrorCode);
    }
    
  }

  /**
   * The function updates a device's position and circle information based on a payload, and dispatches
   * the changes
   * @param elem - The `elem` parameter is an object that represents a device. It contains information
   * about the device's position, circle, interval, and ID, as well as the status of its circle
   * request
   * @param payload - The payload parameter is an array that contains information about position, circle and interval
   * @memberof FetchData
   * @instance    
   */
  const updateDevice = (elem, payload) => {
    let newElements = {};
    if (elem.requests.circle.status != 1 && elem.requests.circle.status != 2 && elem.requests.circle.status != 3) {
      newElements = {
        position: { latitude: payload[0], longitude: payload[1], time: payload[2] },
        circle: { latitude: payload[3], longitude: payload[4], radius: payload[5] },
        interval: payload[6],
        id: elem.id
      }
      unregisterRequest(elem, 'circle', payload[5] ? 11 : 21);
    }
    else {
      newElements = {
        position: { latitude: payload[0], longitude: payload[1], time: payload[2] },
        interval: payload[6],
        id: elem.id
      }
    }
    dispatch(edit(newElements));
  }

  /**
   * The function finds the key in a requests object that matches the response string
   * @param response - The response string that needs to be matched with a request ID
   * @param requests - Object containing current requests
   * @returns Returns the key of the request object in the `requests`
   * array that matches given `response` string.
   * @memberof FetchData
   * @instance    
   */
  const matchRequestKey = (response, requests) => {

    const requestKey = Object.keys(requests).find((key) => {
      const prefix = "resp=" + requests[key].requestId + ",";
      if (response.startsWith(prefix)) {
        return true;
      }
      return false;
    });
    return requestKey;
  }

  /**
   * The function handles the response body of a request and validates its parameters before updating
   * the state based on the code received.
   * @param body - The response body
   * @param elem - Object containing information about single device
   * @returns Returns `false` if the response is not awaited or if the response is invalid. 
   * It returns `true` if the response is valid and the state has been updated based on the code
   * @memberof FetchData
   * @instance    
   */
  const handleBody = (body, elem) => {

    //Check if response is awaited by checking prefix
    const requestKey = matchRequestKey(body, elem.requests);
    if (!requestKey)
      return false;

    console.log('requestKey: ', requestKey);
    //Validate
    const textArray = body.substring(body.indexOf(',') + 1).split(",");
    if (textArray.length != 8 && textArray.length != 1) {
      unregisterRequest(elem, requestKey, 9); //error code 9 
      return false;
    }
    const paramsArray = [
      { type: "int", regex: /^(([0-9])|([1-9][0-9]))$/, ...codeRange },
      { type: "double", regex: LATITUDE_REGEX, ...latitudeRange },
      { type: "double", regex: LONGITUDE_REGEX, ...longitudeRange },
      { type: "int", regex: UNIX_TIME_REGEX, ...unixTimeRange },
      { type: "double", regex: LATITUDE_REGEX, ...latitudeRange },
      { type: "double", regex: LONGITUDE_REGEX, ...longitudeRange },
      { type: "int", regex: RADIUS_REGEX, min: 0, max: radiusRange.max },
      { type: "int", regex: INTERVAL_REGEX, ...intervalRange },
    ];

    //console.log(textArray);

    const allValid = textArray.every((text, index) => {
      const { type, regex, min, max } = paramsArray[index];
      //console.log (text,validateNumber(text, type, regex, min, max));
      return validateNumber(text, type, regex, min, max);
    });

    //Valid response accepted 
    if (!allValid) {
      unregisterRequest(elem, requestKey, 9); //error code 9
      return false;
    }

    const numberArray = textArray.map((text, index) => {
      return paramsArray[index].type == "int" ? parseInt(text) : parseFloat(text);
    });

    const [code, ...payload] = numberArray; 

    //Update state (based on code)
    switch (code) {
      case 1:
        updateDevice(elem, payload);
        unregisterRequest(elem, requestKey, code);
        break;
      case 21:
        const newElements = { circle: { latitude: LATITUDE_DEFAULT, longitude: LONGITUDE_DEFAULT, radius: 0 }, id: elem.id } 
        dispatch(edit(newElements));
        unregisterRequest(elem, requestKey, code);
        break;
      case 11:
      case 10:
      case 12:
      case 20:
        unregisterRequest(elem, requestKey, code);
        break;
      default:
        unregisterRequest(elem, requestKey, 9); //error code 9
        return false;
    }
    return true; 
  }

  /**
   * Wraps the handleBody function
   * @param elem - Object containing information about single device
   * @param message - Object that contains a `body` property.
   * @memberof FetchData
   * @instance    
   */
  const handleMessage = (elem, message) => {
    handleBody(message.body, elem);
  }

  /**
   * The function retrieves messages from the SMS API that match a specific filter and passes them to
   * function that handles each message
   * @param elem - Object containing information about single device
   * @memberof FetchData
   * @instance    
   */
  function getMessages(elem) {
    let filter = {
      address: elem.address,
      bodyRegex: 'resp=(.*)'
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('error' + fail);
      },
      (count, smsList) => {
        if (count > 0) {
          let smsArray = JSON.parse(smsList);
          //console.log("smsArray[0]: ", smsArray[0]);
          smsArray.forEach(message => handleMessage(elem, message))
        }
      }
    );
  }

  /**
   * The function updates a database with a new record containing an address, date and message body,
   * using an ID to identify the specific element to update.
   * @param elem - Object containing information about single device
   * @param message - Object with content of the message and additional information
   * @memberof FetchData
   * @instance    
   */
  const updateDB = (elem, message) => {
    dispatch(addRecord({ record: { address: message.address, date: message.date, body: message.body }, id: elem.id }));
  }

  /**
   * This function retrieves messages from an Android SMS API that match certain criteria
   * and updates a database with the retrieved messages.
   * @param elem - Object containing information about single device
   * @memberof FetchData
   * @instance    
   */
  function getMessagesDB(elem) {
    const hourAgo = Date.now() - 3600000;
    let filter = {
      minDate: hourAgo,
      address: elem.address,
      bodyRegex: 'resp=(.*)'
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('error' + fail);
      },
      (count, smsList) => {
        if (count > 0) {
          let smsArray = JSON.parse(smsList);
          //console.log("smsArray:",smsArray);
          smsArray.forEach(message => updateDB(elem, message))
        }
      }
    );
  }


  /**
   * The function handles messages, requests, timeouts, and retrieves messages from the messaging API
   * on Android and saves unique responses in a database.
   * @param elem - Object containing information about single device
   * @memberof FetchData
   * @instance    
   */
  const handleMessages = (elem) => {
    getMessages(elem); //get messages from messaging API on Android
    getMessagesDB(elem) //get messages from messaging API on Android every unique response saved in Database
    handleRequests(elem);
    handleTimeouts(elem);
  }

  /**
   * The function fetches saved devices and handles messages for each device if permissions are
   * granted.
   * @memberof FetchData
   * @instance    
   */
  function fetch() {
    handlePermissions().then(resp => {
      if (resp) {
        const devices = store.getState().savedDevices;
        //console.log('devices2',devices.requests);
        devices.forEach(elem => handleMessages(elem));
      }
    })
  }

  /**
   * The function checks if SMS permissions are granted
   * @returns Returns a boolean value indicating whether SMS permissions are granted or not.
   * @memberof FetchData
   * @instance    
   */
  const handlePermissions = async () => {

    const sms = await checkSmsPermissions();
    if (sms) {
      //console.log(sms,storage)
      return true
    }
    else
      return false
  }

  return (null);


}