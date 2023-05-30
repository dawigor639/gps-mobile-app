import React, { useState, useEffect } from 'react'
import { Text, View, ToastAndroid } from 'react-native'
import { useIsFocused } from '@react-navigation/native';

import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import { settingsStyles, devicesStyles } from './Styles';
import { NAME_REGEX, ADDRESS_REGEX, PASSWORD_REGEX } from './sharedValidation';


export default function DevicesListElement({ handleSavePress, handleCancelPress, getArrayElement }) {

  const [element, setElement] = useState(getArrayElement);

  const updateElement = (name, value) => {
    setElement(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const [valid, setValid] = useState(
    {
      name: false,
      address: false,
      password: false,
    }
  )

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
