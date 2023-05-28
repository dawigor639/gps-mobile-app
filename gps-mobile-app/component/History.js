import React, { useState , useEffect} from 'react';
import { View, FlatList, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { historyStyles , mapStyles} from './Styles'
import { useIsFocused } from '@react-navigation/native'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

import DevicesListLight from './DevicesListLight';
import HistoryList from './HistoryList'; 

import { useSelector } from 'react-redux'

export default function HistroyScreen() {
  
  const [selectedId, setSelectedId] = useState(1);
  const [isBarClick, setIsBarClick] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
      return () => {
        updateIsBarClick(false);
      }
  }, [isFocused]);

  const updateIsBarClick = (value) => {
    setIsBarClick(value);
  } 

  const devices = useSelector((state) => state.savedDevices);
  const history = useSelector((state) => state.dataBase?.find(elem => elem.id === selectedId)); 

  ////console.log("devices",devices);
  //console.log("history",history);

  /*
  const devices = [
    { id: 1, name: 'Device 1' },
    { id: 2, name: 'Device 2' },
    { id: 3, name: 'Device 3' },
  ];  
  const history = [
    { address: 'Address 1', date: '2023-05-16', body: 'Message 1 eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaaaaaaaaaaaaaaaaaaaaaa1' },
    { address: 'Address 2', date: '2023-05-15', body: 'Message 2' },
    { address: 'Address 3', date: '2023-05-14', body: 'Message 3 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa3' },
  ];*/


  const updateSelectedId = (value) => {
    setSelectedId(value);
    updateIsBarClick(false);
  } 

  return (
    <View style={historyStyles.container}>
      <Text style={historyStyles.title} > History </Text>

      <View style={mapStyles.topBarContainer}>
        <View style={mapStyles.topBar}>
          <View style={mapStyles.topBarInfo}>
            <Text numberOfLines={1} style={mapStyles.topBarText}>
              {devices.find(elem => elem.id === selectedId)?.name}
            </Text>
          </View>

        <Pressable style={{flex: 1, paddingHorizontal: 5}} onPress={ () => updateIsBarClick(!isBarClick)}>
            <Ionicons  name = {"menu-outline"}  size = {60} color = {"black"}/>
        </Pressable>
      </View>

      {isBarClick 
      ? <View style={mapStyles.topBarList}> 
      <DevicesListLight  selectedId={selectedId} updateSelectedId={updateSelectedId} devices={devices}/> 
      </View> 
      : <HistoryList selectedId={selectedId} history={history?.smsRecords}/>
      } 
      </View>
      
    </View>
  );
};





/*
export default function HistroyScreen() {

  return (
 
    <View style={historyStyles.container}>
        
      <Text style={historyStyles.title} > History </Text>

      <View style={historyStyles.button}>
        <Text>
          {"LIST"}
        </Text>
      </View>

    </View>
    )
  }
*/