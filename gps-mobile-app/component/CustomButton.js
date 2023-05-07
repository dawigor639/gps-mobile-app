import React, { useState } from 'react';
import { View, Text , Pressable } from 'react-native';
import { mapStyles } from './Styles';

export default function CustomButton( { name , handleOnPress , disable } ) {

  const [press, setPress] = useState(false)

  const updatePress = (value) => {
    setPress(value);
  }

return (
        <View> 
        <Pressable 
          onPress={handleOnPress}
          onPressIn={() => updatePress(true)}
          onPressOut={() => updatePress(false)}
          disabled = { disable }
        >
      <Text style={ press? mapStyles.textOff : mapStyles.text}>{name}</Text>
      </Pressable>   
        </View>
    )
}
