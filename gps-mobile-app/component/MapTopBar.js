import React, { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

import DevicesList from './DevicesList';
import { mapStyles } from './Styles'
import { useSelector } from 'react-redux'

/**
 * React component that renders a top bar with information about a selected device and allows
 * the user to toggle a list of devices. The component uses hooks such as useState and useEffect to manage state and
 * update the information displayed. It also uses the useSelector hook from the Redux library to access
 * the savedDevices state
 * @param props - The component props
 * @param props.selectedId - The ID of the selected device
 * @param props.updateSelectedId - Updates "selectedId" state
 * @param props.isFocused  - Determine whether the screen is currently focused or not
 * @function MapTopBar
 * @returns {JSX.Element} React component that renders a top bar with information about a selected device,
 * including its name, status, and live time. It also includes a menu button that opens a list of
 * devices to select from
 */
export default function MapTopBar({ selectedId, updateSelectedId, isFocused }) {
  /** Selected savedDevices state from the Redux store 
   * @memberof MapTopBar
   * @instance    
   */
  const devices = useSelector(state => state.savedDevices);
  /** Indicates bar click status
   * @memberof MapTopBar
   * @instance    
   */
  const [isBarClick, setIsBarClick] = useState(false);

  /** Used to display the live time of the selected device
   * @memberof MapTopBar
   * @instance    
   */
  const [timeText, setTimeText] = useState("");

  /* This `useEffect` hook is setting up an interval to update the live time displayed in the top bar of
  a map component. It checks if a `selectedId` is not null, and if so, it sets up an interval that
  calls the `getTime` function every second. The `getTime` function calculates the difference between
  the current time and the time of the selected device's position, and formats it as a string. The
  interval is cleared and the `updateTimeText` function is called to reset the time text when the
  component unmounts or when the `selectedId` or `devices` state changes. */
  useEffect(() => {
    if (selectedId != null) {
      const interval = setInterval(() => getTime(devices.find(elem => elem.id === selectedId)?.position?.time), 1000);
      return () => {
        updateTimeText("");
        clearInterval(interval);
      }
    }
  }, [selectedId, devices]);

  /* This `useEffect` hook is used to update the `isBarClick` state to `false` when the component
  unmounts or when the `isFocused` prop changes. This is done to ensure that the list of devices is
  hidden when the user navigates away from the screen or when the screen loses focus. */
  useEffect(() => {
    return () => {
      updateIsBarClick(false);
    }
  }, [isFocused]);

  /**
   * Updates "isBarClick" state
   * @param value - New value for the state
   * @memberof MapTopBar
   * @instance    
   */
  const updateIsBarClick = (value) => {
    setIsBarClick(value);
  }
  /**
   * Updates "timeText" state
   * @param value - New value for the state
   * @memberof MapTopBar
   * @instance    
   */
  const updateTimeText = (value) => {
    setTimeText(value);
  }

  /**
   * The function updates the selected id and sets the isBarClick value to false
   * @param value - New value for the "selectedID"
   * @memberof MapTopBar
   * @instance    
   */
  const updateSelectedIdWrapped = (value) => {
    updateSelectedId(value);
    updateIsBarClick(false);
  }

  /**
   * Calculates the time difference between the current time and a given time
   * and updates the time text accordingly.
   * @param time - Unix time
   * @memberof MapTopBar
   * @instance    
   */
  const getTime = (time) => {
    //console.log('getTime',time);
    const diff = time ? Math.floor(Date.now() / 1000) - time : false;
    let text = ""
    if (diff) {
      text = secondsToDhms(diff);
    }
    updateTimeText(text);
  }

  /**
   * The function converts a given number of seconds into a string representing the equivalent time in
   * days, hours, minutes, and seconds.
   * @param seconds - The number of seconds to convert into a string representing days,
   * hours, minutes, and seconds.
   * @returns String representing the input number of seconds in the format of "d:h:m:s". The "d"
   * represents days, "h" represents hours, "m" represents minutes, and "s" represents seconds. If a
   * time unit has a value of 0, it is not included in the returned string.
   * @memberof MapTopBar
   * @instance    
   */
  const secondsToDhms = (seconds) => {
    let d = Math.floor(seconds / (3600 * 24));
    let h = Math.floor(seconds % (3600 * 24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);

    let dDisplay = d > 0 ? d + "d:" : "";
    let hDisplay = h > 0 ? h + "h:" : "";
    let mDisplay = m > 0 ? m + "m:" : "";
    let sDisplay = s > 0 ? s + "s" : "0s";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  /**
   * The function decodes a given status code into status message.
   * @param status - The status code that needs to be decoded into a human-readable string
   * @returns Returns a string that corresponds to the status code
   * If the `status` parameter is null or undefined, an empty string is returned
   * @memberof MapTopBar
   * @instance    
   */
  function decodeStatus(status) {
    switch (status) {
      case null:
      case undefined:
        return "";
      case 21:
        return "Unsubscribed";
      case 1:
        return "Sending subscribe request";
      case 2:
        return "Sending unsubscribe request";
      case 3:
        return "Request is pending";
      case 11:
        return "Subscribed";
      case 10:
        return "Subscribe error";
      case 12:
        return "Error subscribers exceeded";
      case 9:
        return "Error in response";
      case 8:
        return "Error timeout";
      case 7:
        return "Error sending request";
      case 20:
        return "Error unsubscribe";
      default:
        return "Unknown status";
    }
  }

  return (

    <View style={mapStyles.topBarContainer}>

      <View style={mapStyles.topBar}>
        <View style={mapStyles.topBarInfo}>

          <Text numberOfLines={1} style={mapStyles.topBarText}>
            {'Car: '}{devices.find(elem => elem.id === selectedId)?.name ?? ""}
          </Text>

          <Text numberOfLines={1} style={mapStyles.topBarText}>
            {'Stat: '}{decodeStatus(devices.find(elem => elem.id === selectedId)?.requests?.circle?.status)}
          </Text>

          <Text numberOfLines={1} style={mapStyles.topBarText}>
            {'Live: '}{timeText}
          </Text>

        </View>

        <Pressable style={{ flex: 1, paddingHorizontal: 5 }} onPress={() => updateIsBarClick(!isBarClick)}>
          <Ionicons name={"menu-outline"} size={60} color={"black"} />
        </Pressable>

      </View>

      {isBarClick && <View style={mapStyles.topBarList}>
        <DevicesList selectedId={selectedId} updateSelectedId={updateSelectedIdWrapped} devices={devices} />
      </View>}

    </View>
  );

}