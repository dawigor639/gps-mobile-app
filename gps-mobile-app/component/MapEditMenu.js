import React, { useState } from 'react';
import { View } from 'react-native';
import { mapStyles } from './Styles'
import CustomTextInput from './CustomTextInput';
import CustomSwitch from './CustomSwitch';
import CustomButton from './CustomButton';
import { LATITUDE_REGEX, LONGITUDE_REGEX, RADIUS_REGEX } from './sharedValidation';
import { latitudeRange, longitudeRange, radiusRange } from './sharedValues';

/**
 * React component that renders a menu with options to edit, delete or confirm safe zone represented by circle object
 * @param props - The component props
 * @param props.updateCircle - This function updates a circle object with a new value for a specified property.
 * @param props.circle - Object representing safe zone
 * @param props.updateIsEdit - Updates "isEdit" state
 * @param props.updateIsConfirm - Updates "isConfirm" state
 * @param props.updateIsDelete - Updates "isDelete" state
 * @function MapEditMenu
 * @returns {JSX.Element} React component that renders a menu with three buttons: "Cancel", "Edit", and "Save"
 */
export default function MapEditMenu({ updateCircle, circle, updateIsEdit, updateIsConfirm, updateIsDelete }) {
  
  /** indicates whether radius or geographic coordinates are being edited 
   * @memberof MapEditMenu
   * @instance    
   */
  const [switchSetting, setSwitchSetting] = useState(false)
  /** Object used to track whether each input field is valid
   * @memberof MapEditMenu
   * @instance    
   */
  const [valid, setValid] = useState(
    {
      radius: true,
      latitude: true,
      longitude: true
    }
  )
 /**
   * This is a function that updates the state of a valid object with a new value for a specific key
   * @param name - Name of the property in the state object that needs to be updated
   * @param value - New value that needs to be assigned to the property with
   * the name specified in the name parameter
   * @memberof MapEditMenu
   * @instance    
   */
  const updateValid = (name, value) => {
    setValid(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  /**
   * The function updates a switch setting with a given value
   * @param value - The value parameter is the new value for the switch setting
   * @memberof MapEditMenu
   * @instance    
   */
  const updateSwitchSetting = (value) => {
    setSwitchSetting(value);
  }
  /**
   * The function handles the confirm button press
   * @memberof MapEditMenu
   * @instance    
   */
  const handleConfirm = () => {
    updateIsEdit(false);
    updateIsConfirm(true);
  }
  /**
   * The function handles the delete button press
   * @memberof MapEditMenu
   * @instance    
   */
  const handleDelete = () => {
    updateIsDelete(true);
    handleConfirm();
  }

  return (
    <View style={mapStyles.editMenu} >

      <View style={mapStyles.rowButtonsContainer}>

        <View style={mapStyles.rowButton} >
          <CustomSwitch name={"Radius"} value={!switchSetting} handleOnPress={() => updateSwitchSetting(false)} />
        </View>

        <View style={mapStyles.rowButton}>
          <CustomSwitch name={"Center"} value={switchSetting} handleOnPress={() => updateSwitchSetting(true)} />

        </View>

      </View>

      <View>
        <CustomTextInput name={"Radius"} type={"int"} maxLength={7} keyboardType={"numeric"} range={radiusRange} regex={RADIUS_REGEX} updateValue={(val) => updateCircle("radius", val)} passValue={circle.radius} updateValid={(val) => updateValid("radius", val)} visible={!switchSetting} />
      </View>

      <View>
        <CustomTextInput name={"Latitude"} type={"double"} maxLength={18} keyboardType={"numeric"} range={latitudeRange} regex={LATITUDE_REGEX} updateValue={(val) => updateCircle("latitude", val)} passValue={circle.latitude} updateValid={(val) => updateValid("latitude", val)} visible={switchSetting} />
      </View>

      <View>
        <CustomTextInput name={"Longitude"} type={"double"} maxLength={18} keyboardType={"numeric"} range={longitudeRange} regex={LONGITUDE_REGEX} updateValue={(val) => updateCircle("longitude", val)} passValue={circle.longitude} updateValid={(val) => updateValid("longitude", val)} visible={switchSetting} />
      </View>

      <View style={mapStyles.rowButtonsContainer}>

        <View style={mapStyles.rowButton} >
          <CustomButton name={"Delete"} handleOnPress={handleDelete} />
        </View>

        <View style={mapStyles.rowButton}>
          <CustomButton name={"Confirm"} handleOnPress={handleConfirm} disable={!(valid.radius && valid.longitude && valid.latitude)} />
        </View>

      </View>

    </View>

  )
}
