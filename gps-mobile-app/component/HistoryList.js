import React from 'react'
import { View, FlatList, Text, TouchableOpacity, Alert } from 'react-native'

import { devicesStyles } from './Styles'

/**
 * The function displays a list of historical items with additional information
 * @function HistoryList
 * @param props - The component props
 * @param props.selectedId - The ID of the selected device
 * @param props.history - History data selected from the Redux store
 * @returns {JSX.Element} It renders a `FlatList` component that displays a list of items from the `history` array.
 * Each item is rendered using the `Item` component, which displays the date and address of the item.
 * When an item is pressed, an alert is displayed
 */
export default function HistoryList({ selectedId, history }) {

  /**
   * The function converts a given number of milliseconds into a formatted date and time string.
   * @param milliseconds - The number of milliseconds since January 1, 1970, 00:00:00 UTC, also known
   * as Unix timestamp.
   * @returns Formatted date and time string in the
   * format "DD.MM.YYYY HH:MM:SS", where DD is the day, MM is the month, YYYY is the year, HH is the
   * hour, MM is the minute, and SS is the second, based on the input `milliseconds`.
   * @memberof HistoryList
   * @instance  
   */
  const millisecondsToDateTime = (milliseconds) => {
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // Format 
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedYear = year;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    // Concatenate the components into the desired format
    const formattedDateTime = formattedDay + '.' + formattedMonth + '.' + formattedYear + ' ' + formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
    return formattedDateTime;
  };
  /**
   * Item used in devices list
   * @param props - The component props
   * @param props.item - The item object to render
   * @param props.onPress - The function to handle item press
   * @param props.backgroundColor - The background color of the item
   * @returns {JSX.Element} The rendered item component
   * @memberof HistoryList
   * @instance    
   */
  const Item = ({ item, onPress, backgroundColor }) => (
    <View style={devicesStyles.item}>
      <TouchableOpacity onPress={onPress} style={{ backgroundColor }}>
        <Text style={devicesStyles.text}>{'date: '}{millisecondsToDateTime(item.date)}{'\n'}{'address: '}{item.address}</Text>
      </TouchableOpacity>
    </View>
  );
  /**
   * Renders an `Item` component, it can be pressed to display additional data
   * @param props - The function props.
   * @param props.item - The item object to render.
   * @returns The rendered item component
   * @memberof HistoryList
   * @instance    
   */
  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => Alert.alert(millisecondsToDateTime(item.date), item.body)}
        backgroundColor={'white'}
      />
    )
  };

  return (
    <View style={{ ...devicesStyles.flatList, margin: 10 }}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={selectedId}
      />
    </View>
  );

}