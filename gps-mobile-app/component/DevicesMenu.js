import React from 'react';
import { View } from 'react-native';
import { devicesStyles } from './Styles'
import CustomButton from './CustomButton';

export default function DevicesMenu( {handleAddPress, handleEditPress, handleDeletePress, selectedId}  ) {
  return (
    <View style={devicesStyles.listMenuContainer}>

    <View style = {devicesStyles.menuElement}>
    <CustomButton name={"Add"} handleOnPress={handleAddPress} />
    </View>

    <View style = {devicesStyles.menuElement}>
    <CustomButton name={"Edit"} handleOnPress={handleEditPress} disable={!selectedId}/>
    </View>

    <View style = {devicesStyles.menuElement}>
    <CustomButton name={"Delete"} handleOnPress={handleDeletePress} disable={!selectedId}/>
    </View>

     </View>
  )
}