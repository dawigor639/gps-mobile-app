import React from 'react';
import { View, Text , Pressable } from 'react-native';
import { mapStyles } from './Styles';

export default function CustomSwitch( { name , value , handleOnPress } ) {

return (
        <View> 
        <Pressable style={mapStyles.button}
          onPress={handleOnPress}
        >
      <Text style={ value ? mapStyles.text : mapStyles.textOff}>{name}</Text>
      </Pressable>   
        </View>
    )
}
