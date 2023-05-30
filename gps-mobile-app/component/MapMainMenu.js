import React from 'react';
import { View } from 'react-native';
import { mapStyles } from './Styles'
import CustomSwitch from './CustomSwitch';
import CustomButton from './CustomButton';

export default function MapMainMenu({ handleEditPress, handleShowMarker, showCarMarker }) {
  return (
    <View style={mapStyles.menu}>

      <View style={mapStyles.menuElement}>
        <CustomButton name={"Edit"} handleOnPress={handleEditPress} />
      </View>

      <View style={mapStyles.menuElement}>
        <CustomSwitch name={"Marker"} value={showCarMarker} handleOnPress={handleShowMarker} />
      </View>

    </View>
  )
}