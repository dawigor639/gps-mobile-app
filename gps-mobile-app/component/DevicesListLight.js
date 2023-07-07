import React from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'

import { devicesStyles } from './Styles'

/**
 * The function renders a simple list of devices
 * @function DevicesListLight
 * @param props - The component props
 * @param props.selectedId - The ID of the selected device
 * @param props.updateSelectedId - The function to update the selected device ID
 * @param props.devices - The array of devices to display
 * @returns {JSX.Element} Renders a FlatList of devices with their
 * information and a colored square indicating their status. The function also includes a helper
 * function called getColorByStatus and a sub-component called RoundedSquare. The selected device is
 * highlighted with a blue background color
 */
export default function DevicesListLight({ selectedId, updateSelectedId, devices }) {

  /**
   * Item used in devices list
   * @param props - The component props
   * @param props.item - The item object to render
   * @param props.onPress - The function to handle item press
   * @param props.backgroundColor - The background color of the item
   * @returns {JSX.Element} The rendered item component
   * @memberof DevicesListLight
   * @instance    
   */
  const Item = ({ item, onPress, backgroundColor }) => (
    <View style={devicesStyles.item}>
      <TouchableOpacity onPress={onPress} style={{ backgroundColor }}>
        <Text style={devicesStyles.text}>{'name: '}{item.name}{'\n'}{'address: '}{item.address}</Text>
      </TouchableOpacity>
    </View>
  );
  /**
   * Renders an `Item` component
   * @param props - The component props
   * @param props.item - The item object to render
   * @returns The rendered item component
   * @memberof DevicesListLight
   * @instance    
   */
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