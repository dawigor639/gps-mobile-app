import React from 'react';
import { View } from 'react-native';
import { mapStyles } from './Styles'
import CustomSwitch from './CustomSwitch';
import CustomButton from './CustomButton';

/**
 * Component that displays a menu with an "Edit" button and a switch to show or
 * hide a marker.
 * @param props - The component props
 * @param props.handleEditPress - The function handles the edit button press
 * @param props.handleShowMarker - The function handles pressing switch used to show or hide marker
 * @param props.showCarMarker - Variable indicating whether to show or hide the marker
 * @function MapMainMenu
 * @returns {JSX.Element} React component that renders a menu with two elements: button and switch
 */
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