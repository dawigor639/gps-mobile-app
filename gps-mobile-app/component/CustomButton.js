import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { mapStyles } from './Styles';

/**
 * This is a custom button component in JavaScript that changes its style when pressed and can be
 * disabled
 * @param props - The component props
 * @param props.name - Button name
 * @param props.handleOnPress - The function handles the cancel button press
 * @param props.disable - Whether the press behaviour is disabled
 * @function CustomButton
 * @returns {JSX.Element} Return customised button element
 */
export default function CustomButton({ name, handleOnPress, disable }) {

  /** Informs whether the button is being pressed or not
   * @memberof CustomButton
   * @instance    
   */
  const [press, setPress] = useState(false)

  /**
   * The function updates the value of a variable called "press".
   * @param value - new value for "press" state
   * @memberof CustomButton
   * @instance    
   */
  const updatePress = (value) => {
    setPress(value);
  }

  return (
    <View>
      <Pressable
        onPress={handleOnPress}
        onPressIn={() => updatePress(true)}
        onPressOut={() => updatePress(false)}
        disabled={disable}
      >
        <Text style={press ? mapStyles.textOff : mapStyles.text}>{name}</Text>
      </Pressable>
    </View>
  )
}
