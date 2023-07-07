import React from 'react';
import { View } from 'react-native';
import { devicesStyles } from './Styles'
import CustomButton from './CustomButton';

/**
 * The DevicesMenu function returns a view containing three CustomButton components for adding,
 * editing, and deleting devices, with the edit and delete buttons disabled if no device is selected
 * @param props - The component props
 * @param props.handleAddPress - The function handles the add button press
 * @param props.handleEditPress - The function handles the edit button press
 * @param props.handleDeletePress  - The function handles the delete button press
 * @param props.selectedId - The ID of the selected device
 * @function DevicesMenu
 * @returns {JSX.Element} A React component that renders a menu with three buttons: "Add", "Edit", and "Delete"
 */
export default function DevicesMenu({ handleAddPress, handleEditPress, handleDeletePress, selectedId }) {
  return (
    <View style={devicesStyles.listMenuContainer}>

      <View style={devicesStyles.menuElement}>
        <CustomButton name={"Add"} handleOnPress={handleAddPress} />
      </View>

      <View style={devicesStyles.menuElement}>
        <CustomButton name={"Edit"} handleOnPress={handleEditPress} disable={!selectedId} />
      </View>

      <View style={devicesStyles.menuElement}>
        <CustomButton name={"Delete"} handleOnPress={handleDeletePress} disable={!selectedId} />
      </View>

    </View>
  )
}