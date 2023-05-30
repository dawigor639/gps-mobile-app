import React from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'

import { devicesStyles } from './Styles'

export default function DevicesList({ selectedId, updateSelectedId, devices }) {

  const Item = ({ item, onPress, backgroundColor }) => (
    <View style={devicesStyles.item}>
      <TouchableOpacity onPress={onPress} style={{ backgroundColor }}>
        <Text style={devicesStyles.text}>{'name: '}{item.name}{'\n'}{'address: '}{item.address}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => item.id === updateSelectedId(item.id)}
        backgroundColor={'white'}
      />
    )
  };

  return (
    <View style={devicesStyles.flatList}>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </View>
  );

}