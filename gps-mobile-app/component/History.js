import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { historyStyles, mapStyles } from './Styles'
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DevicesListLight from './DevicesListLight';
import HistoryList from './HistoryList';

import { useSelector } from 'react-redux'

/**
 * This is a React Native component that displays a history screen with a list of saved devices and
 * their SMS records.
 * @function History
 * @returns {JSX.Element} Renders a view containing a title, a bar container, and either a list of devices or a list of SMS records depending on the state of
 * the `isBarClick` variable. The component also uses state variables such as `selectedId` and
 * `isBarClick`, and Redux selectors to retrieve data from the store.
 */
export default function HistroyScreen() {

  /** Id of the selected device 
   * @memberof History
   * @instance    
   */
  const [selectedId, setSelectedId] = useState(1);
  /** Indicates bar click status
   * @memberof History
   * @instance    
   */
  const [isBarClick, setIsBarClick] = useState(false);
  /** Determine whether the screen is currently focused or not 
   * @memberof History
   * @instance    
   */
  const isFocused = useIsFocused();
  /** Selected `savedDevices` state from the Redux store    
 * @memberof History
 * @instance    
 */
  const devices = useSelector((state) => state.savedDevices);
  /** History data selected from the Redux store that has an `id` property matching the current value of the `selectedId` state.
   * It is used in the `HistoryList` component 
   * @memberof History
   * @instance    
   */
  const history = useSelector((state) => state.dataBase?.find(elem => elem.id === selectedId));

  /* This is a cleanup function that is executed when the component unmounts or when the `isFocused`
  state variable changes */
  useEffect(() => {
    return () => {
      updateIsBarClick(false);
    }
  }, [isFocused]);
  /**
   * Updates "isBarClick" state
   * @param value - New value that will be assigned to the "isBarClick" state
   * @memberof History
   * @instance    
   */
  const updateIsBarClick = (value) => {
    setIsBarClick(value);
  }

  /**
   * Updates "selectedId" state
   * @param value - New value that will be assigned to the "selectedId" state
   * @memberof History
   * @instance    
   */
  const updateSelectedId = (value) => {
    setSelectedId(value);
    updateIsBarClick(false);
  }

  return (
    <View style={historyStyles.container}>
      <Text style={historyStyles.title} > History </Text>

      <View style={mapStyles.topBarContainer}>
        <View style={mapStyles.topBar}>
          <View style={mapStyles.topBarInfo}>
            <Text numberOfLines={1} style={mapStyles.topBarText}>
              {devices.find(elem => elem.id === selectedId)?.name}
            </Text>
          </View>

          <Pressable style={{ flex: 1, paddingHorizontal: 5 }} onPress={() => updateIsBarClick(!isBarClick)}>
            <Ionicons name={"menu-outline"} size={60} color={"black"} />
          </Pressable>
        </View>

        {isBarClick
          ? <View style={mapStyles.topBarList}>
            <DevicesListLight selectedId={selectedId} updateSelectedId={updateSelectedId} devices={devices} />
          </View>
          : <HistoryList selectedId={selectedId} history={history?.smsRecords} />
        }
      </View>

    </View>
  );
};