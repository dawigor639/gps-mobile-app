import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { mapStyles } from './Styles';

/**
 * Custom switch component that changes style based on the prop value
 * @param props - The component props
 * @param props.name - Switch name
 * @param props.value - Switch value
 * @param props.handleOnPress - function called on switch press
 * @function CustomSwitch
 * @returns {JSX.Element} Return customised switch element
 */
export default function CustomSwitch({ name, value, handleOnPress }) {

  return (
    <View>
      <Pressable style={mapStyles.button}
        onPress={handleOnPress}
      >
        <Text style={value ? mapStyles.text : mapStyles.textOff}>{name}</Text>
      </Pressable>
    </View>
  )
}
