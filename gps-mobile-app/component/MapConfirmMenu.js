import React from 'react';
import { View, ToastAndroid } from 'react-native';
import { mapStyles } from './Styles'
import CustomButton from './CustomButton';

export default function MapConfirmMenu({ handleEditPress, handleCancelPress, handleSavePress }) {

  return (
    <View style={mapStyles.editMenu}>

      <View style={mapStyles.menuElement}>
        <CustomButton name={"Cancel"} handleOnPress={handleCancelPress} />
      </View>

      <View style={mapStyles.menuElement}>
        <CustomButton name={"Edit"} handleOnPress={handleEditPress} />
      </View>

      <View style={mapStyles.menuElement}>
        <CustomButton name={"Save"} handleOnPress={handleSavePress} />
      </View>

    </View>
  )
}
