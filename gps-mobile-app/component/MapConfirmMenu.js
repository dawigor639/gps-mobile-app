import React from 'react';
import { View } from 'react-native';
import { mapStyles } from './Styles'
import CustomButton from './CustomButton';
/**
 * This is a React component that renders a menu with three buttons for editing, canceling or saving 
 * @param props - The component props
 * @param props.handleEditPress - The function handles the edit button press
 * @param props.handleCancelPress - The function handles the cancel button press
 * @param props.handleSavePress - The function handles the save button press
 * @function MapConfirmMenu
 * @returns {JSX.Element} React component that renders a menu with three buttons: "Cancel", "Edit", and "Save"
 */
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
