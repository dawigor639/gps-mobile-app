import React from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'

import { devicesStyles } from './Styles'

/**
 * The function renders a list of devices with their status and information, allowing the user to
 * select a device and update the selected device ID
 * @function DevicesList
 * @param props - The component props
 * @param props.selectedId - The ID of the selected device
 * @param props.updateSelectedId - The function to update the selected device ID
 * @param props.devices - The array of devices to display
 * @returns {JSX.Element} Renders a FlatList of devices with their
 * information and a colored square indicating their status. The function also includes a helper
 * function called getColorByStatus and a sub-component called RoundedSquare. The selected device is
 * highlighted with a blue background color
 */
export default function DevicesList({ selectedId, updateSelectedId, devices }) {

  /**
   * The function returns a color based on a given status code
   * @param status - The parameter "status" is a number that is used as input to the function
   * "getColorByStatus". The function returns a color based on the value of the status parameter.
   * @returns String representing a color based on the input
   * `status`. The color returned depends on the value of `status` and is determined by the switch
   * statement. If `status` is 21, the function returns 'white'. If `status` is 1 or 2, the function
   * returns 'grey'. If `status` is 3, the function
   * @memberof DevicesList
   * @instance    
   */
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

  /**
   * Rounded square component with a specified color
   * @param props - The component props
   * @param props.color - color of rendered element
   * @returns {JSX.Element} A React component that renders a rounded square with a specified color
   * @memberof DevicesList
   * @instance    
   */
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

/**
 * Item used in devices list
 * @param props - The component props
 * @param props.item - The item object to render
 * @param props.onPress - The function to handle item press
 * @param props.backgroundColor - The background color of the item
 * @returns {JSX.Element} The rendered item component
 * @memberof DevicesList
 * @instance    
 */
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

  /**
   * Renders an `Item` component with background color based on id
   * @param props - The component props
   * @param props.item - The item object to render
   * @returns The rendered item component
   * @memberof DevicesList
   * @instance    
   */
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