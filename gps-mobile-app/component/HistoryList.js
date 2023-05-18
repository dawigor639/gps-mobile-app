import React from 'react'
import { View, FlatList, Text, TouchableOpacity, Alert } from 'react-native'

import {devicesStyles} from './Styles'

export default function HistoryList ( {selectedId, history} ) {

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
    const formattedDateTime = formattedDay+'.' +formattedMonth +'.' +formattedYear +' ' +formattedHours +':' +formattedMinutes +':'+formattedSeconds;
    return formattedDateTime;
  };

  const Item = ({item, onPress, backgroundColor}) => (
      <View style={devicesStyles.item}>
        <TouchableOpacity onPress={onPress} style={{backgroundColor}}>
          <Text style={devicesStyles.text}>{'date: '}{millisecondsToDateTime(item.date)}{'\n'}{'address: '}{item.address}</Text>
        </TouchableOpacity>
      </View>
    );

  const renderItem = ({item}) => {
    return (
      <Item
        item={item}
          onPress={() => Alert.alert(millisecondsToDateTime(item.date), item.body)}
          backgroundColor={'white'}
      />
  )};
    
  return (
    <View style={devicesStyles.flatList}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={selectedId}
      />
    </View>
  );
      
}