import React , {useState , useEffect } from 'react'
import {Text, View , ToastAndroid } from 'react-native'
import { devicesStyles, settingsStyles} from './Styles'
import { useIsFocused } from '@react-navigation/native';

import DevicesList from './DevicesList';
import DevicesMenu from './DevicesMenu'; 
import DevicesListElement from './DevicesListElement';

import { useSelector, useDispatch } from 'react-redux'
import { addDeviceThunk, edit, delDeviceThunk } from './ReduxDevices'

export default function Devices () {
  
  const devices = useSelector((state) => state.savedDevices);
  const dispatch = useDispatch();

  const [selectedId, setSelectedId] = useState(null);  
  const [whatPressed, setwhatPressed] = useState(null); 
  const [isEdit, setIsEdit] = useState(false)

  const updateWhatPressed = (value) => {
    setwhatPressed(value);
    } 

  const updateSelectedId = (value) => {
    setSelectedId(value);
    } 

  const updateIsEdit = (value) => {
  setIsEdit(value);
  } 

  const handleAddPress = () => {
    updateSelectedId(null);
    updateWhatPressed(1);
    updateIsEdit(true);
   } 

   const handleEditPress = () => { 
    const status = devices.find(elem => elem.id === selectedId)?.requests?.circle?.status;
    if ( status == 3 ) {
      ToastAndroid.show("Request is still pending!", ToastAndroid.SHORT);
    } else {
      updateWhatPressed(2);
      updateIsEdit(true);
    }
  } 

  const handleDeletePress = () => { 
    const status = devices.find(elem => elem.id === selectedId)?.requests?.circle?.status;
    if ( status == 3 ) {
      ToastAndroid.show("Request is still pending!", ToastAndroid.SHORT);
    } else {
     dispatch(delDeviceThunk(selectedId))
     updateSelectedId(null);
    } 
  }

  const handleCancelPress = () => {
    updateSelectedId(null);
    updateIsEdit(false);
  }

  const checkDuplicate = (newElement) => {

    const duplicate = devices.some(elem => {
      if (elem.address == newElement.address) {
        //const overWritten =  {...newElement, id: elem.id};
        //dispatch(edit(overWritten));
        return true;
      } else
        return false;
    });
    
    return duplicate
  }

  const handleSavePress = (newElement) => {

    if (whatPressed===1) {     //add
      if (checkDuplicate(newElement)) {
        ToastAndroid.show("Device already exist, change address!", ToastAndroid.SHORT);
      }
      else {
        dispatch(addDeviceThunk(newElement));
        ToastAndroid.show("Saved!", ToastAndroid.SHORT);
        updateSelectedId(null);
        updateIsEdit(false);
      }

    }
    else if (whatPressed===2) {//update
      dispatch(edit(newElement));
      ToastAndroid.show("Saved!", ToastAndroid.SHORT);
      updateSelectedId(null);
      updateIsEdit(false);
    }

  }

  /*
  interval: {value: 120, status: 0} 
  interval: {value: arrayElement.interval.value, status: arrayElement.interval.status},
  */

  const getArrayElement = () => {
    let arrayElement={name: "", address: "", password: "" };
    if (whatPressed===1) 
      return(arrayElement)
    else if (whatPressed===2) {
      arrayElement=devices.find(elem => (elem.id === selectedId));
      //console.log({name: arrayElement.name, address: arrayElement.address})
      return({name: arrayElement.name, address: arrayElement.address, password: arrayElement.password, 
        id: arrayElement.id})   
    }
    else 
    return(arrayElement)
  }

  return (
    <View style={devicesStyles.container}>
      <Text style={devicesStyles.title} > Devices </Text>
        <DevicesList selectedId={selectedId} updateSelectedId={updateSelectedId} devices={devices}/>
      <DevicesMenu handleAddPress={handleAddPress} handleEditPress={handleEditPress} handleDeletePress={handleDeletePress} selectedId={selectedId}/>
      {isEdit && <DevicesListElement handleSavePress={handleSavePress} handleCancelPress={handleCancelPress} getArrayElement={getArrayElement} />}
        
    </View>
      
  )
  
  }