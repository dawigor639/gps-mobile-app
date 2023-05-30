import React from 'react'
import { View, FlatList, Text, TouchableOpacity, ToastAndroid } from 'react-native'

import { devicesStyles } from './Styles'

export default function DevicesList({ selectedId, updateSelectedId, devices }) {

  function getColorByStatus(status) {
    switch (status) {
      case 21:
        return 'white';
      case 1:
        return 'grey';
      case 2:
        return 'grey';
      case 3:
        return 'yellow';
      case 11:
        return 'lime';
      default:
        return 'red';
    }
  }

  function RoundedSquare({ color }) {
    return (
      <View style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: color,
        margin: 5
      }}>
      </View>
    );
  }

  const Item = ({ item, onPress, backgroundColor }) => (
    <View style={devicesStyles.item}>
      <TouchableOpacity onPress={onPress} style={{ backgroundColor }}>

        <View style={{
          flexDirection: 'row', justifyContent: 'center'
        }}>
          <RoundedSquare color={getColorByStatus(item.requests.circle.status)} />
          <Text style={devicesStyles.title}>{'Device '}{item.id}</Text>
        </View>

        <Text style={devicesStyles.text}>{'name: '}{item.name}{'\n'}{'address: '}{item.address}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? 'dodgerblue' : 'white';
    return (
      <Item
        item={item}
        onPress={() => updateSelectedId(item.id)}
        backgroundColor={backgroundColor}
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