import React ,  { useState, useEffect, useContext} from 'react'
import { View, Text , Pressable} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons';

import DevicesList from './DevicesList';
import { mapStyles, devicesStyles} from './Styles'
import { useSelector} from 'react-redux'

export default function MapTopBar( {selectedId, updateSelectedId, isFocused} ) {

  const devices = useSelector(state => state.savedDevices);

  const [isBarClick, setIsBarClick] = useState(false);
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    if(selectedId!=null) {
      updateIsBarClick(false);

      const interval = setInterval(() => getTime( devices.find(elem => elem.id === selectedId)?.position?.time ), 1000);
      return () => {
        updateTimeText("");
        clearInterval(interval);
      }

    }
  }, [selectedId,devices]);

  useEffect(() => {
      return () => {
        updateIsBarClick(false);
      }
  }, [isFocused]);

  const updateIsBarClick = (value) => {
    setIsBarClick(value);
  } 

  const updateTimeText = (value) => {
    setTimeText(value);
  } 
  
  const getTime = (time) => {
    //console.log('getTime',time);
    const diff = time ? Math.floor( Date.now() / 1000) - time : false;
    let text = ""
    if (diff) {
    text=secondsToDhms(diff);
    }
    updateTimeText(text);
  }
      
  const secondsToDhms= (seconds) => {
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    
    let dDisplay = d > 0 ? d + "d:" : "";
    let hDisplay = h > 0 ? h + "h:" : "";
    let mDisplay = m > 0 ? m + "m:" : "";
    let sDisplay = s > 0 ? s + "s" : "0s";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

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
          {'Stat: '}{ decodeStatus(devices.find(elem => elem.id === selectedId)?.requests?.circle?.status) }
          </Text>

          <Text numberOfLines={1} style={mapStyles.topBarText}>
          {'Live: '}{timeText}
          </Text>
         

        </View>



        <Pressable style={{flex: 1}} onPress={ () => updateIsBarClick(!isBarClick)}>
            <Octicons  name = {"three-bars"}  size = {40} color = {"black"}/>
        </Pressable>

      </View>

      {isBarClick && <View style={mapStyles.topBarList}>
       <DevicesList  selectedId={selectedId} updateSelectedId={updateSelectedId} devices={devices}/> 
      </View> }

      </View>
    );
        
  }