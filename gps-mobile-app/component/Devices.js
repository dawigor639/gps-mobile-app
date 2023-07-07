import React, { useState, useEffect } from 'react'
import { Text, View, ToastAndroid } from 'react-native'
import { devicesStyles } from './Styles'
import { useIsFocused } from '@react-navigation/native';

import DevicesList from './DevicesList';
import DevicesMenu from './DevicesMenu';
import DevicesListElement from './DevicesListElement';

import { useSelector, useDispatch } from 'react-redux'
import { addDeviceThunk, edit, delDeviceThunk } from './ReduxDevices'

/**
 * Displays a list of devices and allows the user to add, edit, or delete devices, with
 * the ability to save changes and display toast messages
 * @function Devices
 * @returns {JSX.Element} Renders a title, a list of devices, and a menu with buttons for adding, 
 * editing, and deleting devices. It also conditionally renders a form for editing or adding a device,
 * depending on the state
 */
export default function Devices() {

  /** Selected `savedDevices` state from the Redux store    
   * @memberof Devices
   * @instance    
   */
  const devices = useSelector((state) => state.savedDevices);
  /** Dispatch actions to the Redux store    
   * @memberof Devices
   * @instance    
   */
  const dispatch = useDispatch();
  /** Id of the selected device    
   * @memberof Devices
   * @instance    
   */
  const [selectedId, setSelectedId] = useState(null);
  /** Informs what button was pressed    
   * @memberof Devices
   * @instance    
   */
  const [whatPressed, setWhatPressed] = useState(null);
  /** Indicates whether editing is active    
   * @memberof Devices
   * @instance    
   */
  const [isEdit, setIsEdit] = useState(false)

  /**
   * Updates "whatPressed" state
   * @param value - New value that will be assigned to the "whatPressed" state
   * @memberof Devices
   * @instance    
   */
  const updateWhatPressed = (value) => {
    setWhatPressed(value);
  }
  /**
   * Updates "selectedId" state
   * @param value - New value that will be assigned to the "selectedId" state
   * @memberof Devices
   * @instance    
   */
  const updateSelectedId = (value) => {
    setSelectedId(value);
  }

  /**
   * Updates "isEdit" state
   * @param value - New value that will be assigned to the "isEdit" state
   * @memberof Devices
   * @instance    
   */
  const updateIsEdit = (value) => {
    setIsEdit(value);
  }

  /** Determine whether the screen is currently focused or not 
   * @memberof Devices
   * @instance    
   */
  const isFocused = useIsFocused();

  /* This is a cleanup function that is executed when the component unmounts or when the `isFocused`
  state variable changes */
  useEffect(() => {
    return () => {
      updateIsEdit(false);
      updateSelectedId(null);
    }
  }, [isFocused]);

  /**
   * The function handles the add button press
   * @memberof Devices
   * @instance    
   */
  const handleAddPress = () => {
    updateSelectedId(null);
    updateWhatPressed(1);
    updateIsEdit(true);
  }
  /**
   * The function handles the edit button press
   * @memberof Devices
   * @instance    
   */
  const handleEditPress = () => {
    const status = devices.find(elem => elem.id === selectedId)?.requests?.circle?.status;
    if (status == 3) {
      ToastAndroid.show("Request is still pending!", ToastAndroid.SHORT);
    } else {
      updateWhatPressed(2);
      updateIsEdit(true);
    }
  }
  /**
   * The function handles the delete button press
   * @memberof Devices
   * @instance    
   */
  const handleDeletePress = () => {
    const status = devices.find(elem => elem.id === selectedId)?.requests?.circle?.status;
    if (status == 3) {
      ToastAndroid.show("Request is still pending!", ToastAndroid.SHORT);
    } else {
      dispatch(delDeviceThunk(selectedId))
      updateSelectedId(null);
    }
  }
  /**
   * The function handles the cancel button press
   * @memberof Devices
   * @instance    
   */
  const handleCancelPress = () => {
    updateSelectedId(null);
    updateIsEdit(false);
  }
  /**
   * The function handles saving new or edited device information and displays a toast message
   * @param newElement - a new object that contains the updated information of a device
   * @memberof Devices
   * @instance    
   */
  const handleSavePress = (newElement) => {
    if (whatPressed === 1) { 
      dispatch(addDeviceThunk(newElement));
      ToastAndroid.show("Saved!", ToastAndroid.SHORT);
      updateSelectedId(null);
      updateIsEdit(false);
    }
    else if (whatPressed === 2) {
      dispatch(edit(newElement));
      ToastAndroid.show("Saved!", ToastAndroid.SHORT);
      updateSelectedId(null);
      updateIsEdit(false);
    }
  }

  /**
   * The function returns an object with name, address, and password properties based on the value of
   * the variable "whatPressed" and the selected device ID
   * @returns Object with properties `name`, `address`, and `password`, and an additional property `id` 
   * if element was found based on id
   * @memberof Devices
   * @instance    
   */
  const getArrayElement = () => {
    let arrayElement = { name: "", address: "", password: "" };
    if (whatPressed === 1)
      return (arrayElement)
    else if (whatPressed === 2) {
      arrayElement = devices.find(elem => (elem.id === selectedId));
      //console.log({name: arrayElement.name, address: arrayElement.address})
      return ({
        name: arrayElement.name, address: arrayElement.address, password: arrayElement.password,
        id: arrayElement.id
      })
    }
    else
      return (arrayElement)
  }

  return (
    <View style={devicesStyles.container}>
      <Text style={devicesStyles.title} > Devices </Text>
      <DevicesList selectedId={selectedId} updateSelectedId={updateSelectedId} devices={devices} />
      <DevicesMenu handleAddPress={handleAddPress} handleEditPress={handleEditPress} handleDeletePress={handleDeletePress} selectedId={selectedId} />
      {isEdit && <DevicesListElement handleSavePress={handleSavePress} handleCancelPress={handleCancelPress} getArrayElement={getArrayElement} />}

    </View>

  )

}