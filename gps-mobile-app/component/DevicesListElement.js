import React, { useState } from 'react'
import { Text, View } from 'react-native'
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import { devicesStyles } from './Styles';
import { NAME_REGEX, ADDRESS_REGEX, PASSWORD_REGEX } from './sharedValidation';

/**
 * Functional component that renders a form for updating device information, including name,
 * address, and password, with validation and save/cancel buttons.
 * @function DevicesListElement
 * @param props - The component props
 * @param props.handleSavePress - The function handles saving new or edited device information and displays a toast message
 * @param props.handleCancelPress - The function handles the cancel button press.
 * @param props.getArrayElement - The function returns an object with name, address, 
 * and password properties based on the value of the variable "whatPressed" and the selected device ID.
 * @returns {JSX.Element}
 * @returns A React component that renders a form for updating device information, including fields for
 * name, address, and password, as well as buttons for saving or canceling changes. The component uses
 * state to track the current values of the device information and whether each field is valid based on
 * regular expressions. The component also receives props for handling save and cancel actions and
 * retrieving the current device information.
 */
export default function DevicesListElement({ handleSavePress, handleCancelPress, getArrayElement }) {

  /** Object representing selected array element
   * @memberof DevicesListElement
   * @instance    
   */
  const [element, setElement] = useState(getArrayElement);

  /**
   * This is a function that updates an element's state with a new value based on its name.
   * @param name - Name of the element being updated. It
   * is used as a key in the object being updated with the new value.
   * @param value - The value that needs to be updated for the element.
   * @memberof DevicesListElement
   * @instance    
   */
  const updateElement = (name, value) => {
    setElement(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  /** Object used to track whether each input field in the form is valid
   * @memberof DevicesListElement
   * @instance    
   */
  const [valid, setValid] = useState(
    {
      name: false,
      address: false,
      password: false,
    }
  )

  /**
   * This is a function that updates the state of a valid object with a new value for a specific key
   * @param name - Name of the property in the state object that needs to be updated
   * @param value - New value that needs to be assigned to the property with
   * the name specified in the name parameter
   * @memberof DevicesListElement
   * @instance    
   */
  const updateValid = (name, value) => {
    setValid(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (

    <View style={devicesStyles.updateMenuContainer}>
      <Text style={devicesStyles.title} > Devices </Text>

      <CustomTextInput name={"Name"} type={"string"} maxLength={60} keyboardType={"default"} regex={NAME_REGEX} updateValue={(val) => updateElement("name", val)} passValue={element.name} updateValid={(val) => updateValid("name", val)} />
      <CustomTextInput name={"Address"} type={"string"} maxLength={17} keyboardType={"default"} regex={ADDRESS_REGEX} updateValue={(val) => updateElement("address", val)} passValue={element.address} updateValid={(val) => updateValid("address", val)} />
      <CustomTextInput name={"Password"} type={"string"} maxLength={22} keyboardType={"numeric"} regex={PASSWORD_REGEX} updateValue={(val) => updateElement("password", val)} passValue={element.password} secure={true} updateValid={(val) => updateValid("password", val)} />


      <View style={devicesStyles.menuContainer}>
        <View style={devicesStyles.menuElement}>
          <CustomButton name={"Cancel"} handleOnPress={handleCancelPress} />
        </View>
        <View style={devicesStyles.menuElement}>
          <CustomButton name={"Save"} handleOnPress={() => handleSavePress(element)} disable={!(valid.name && valid.address && valid.password)} />
        </View>
      </View>
    </View>
  )

}
