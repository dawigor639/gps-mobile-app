import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, ToastAndroid, Image } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';

import { mapStyles, customMapStyle } from './Styles';
import MapMainMenu from './MapMainMenu';
import MapEditMenu from './MapEditMenu';
import MapConfirmMenu from './MapConfirmMenu';
import MapTopBar from './MapTopBar';
import FetchData from './FetchData';

import { radiusRange, LATITUDE_DEFAULT, LONGITUDE_DEFAULT } from './sharedValues';
import { useSelector, useDispatch } from 'react-redux'
import { editCircle } from './ReduxDevices'

/* Image file used as the icon for a Marker component in the MapView */
const carMarker = require('./../img/carMarker.png');
let { /* Width of the device's screen */ width,  /* Height of the device's screen */ height } = Dimensions.get('window');
/* Calculated aspect ratio of the device's screen */
const ASPECT_RATIO = width / height;
/* Default zoom level for the map */
const LATITUDE_DELTA = 0.003;
/* Distance shown on the map */
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

/**
 * Displays a map with a marker and circle, and allows the user to
 * edit the circle's position and radius. The component also uses Redux to manage state and dispatch actions to update the state
 * @function Map
 * @returns {JSX.Element} Renders a `MapView` from the `react-native-maps` library along with various menus and buttons for editing 
 * and updating the map
 */
export default function Map() {

  /** Reference to the MapView component 
   * @memberof Map
   * @instance    
   */
  const mapRef = useRef()

  /** Object representing position 
   * @memberof Map
   * @instance    
   */
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  })

  /** Object representing safe zone 
   * @memberof Map
   * @instance    
   */
  const [circle, setCircle] = useState({
    latitude: LATITUDE_DEFAULT,
    longitude: LONGITUDE_DEFAULT,
    radius: 0,
  })
  /** Id of the selected device 
   * @memberof Map
   * @instance    
   */
  const [selectedId, setSelectedId] = useState(1);
  /** Indicates whether editing is active 
   * @memberof Map
   * @instance    
   */
  const [isEdit, setIsEdit] = useState(false)
  /** Indicates whether confirmation is active 
   * @memberof Map
   * @instance    
   */
  const [isConfirm, setIsConfirm] = useState(false)
  /** Indicates whether deletion is active 
   * @memberof Map
   * @instance    
   */
  const [isDelete, setIsDelete] = useState(false);
  /** Variable indicating whether to show or hide the marker 
   * @memberof Map
   * @instance    
   */
  const [showCarMarker, setShowCarMarker] = useState(true)

  /** Selected device object from the `savedDevices` array in the Redux store. The `find` method is used
   * to search for the device object with an `id` property that matches the `selectedId` state
   * variable 
   * @memberof Map
   * @instance    
   */
  const device = useSelector((state) => state.savedDevices?.find(elem => elem.id === selectedId));

  /** Determine whether the screen is currently focused or not 
   * @memberof Map
   * @instance    
   */
  const isFocused = useIsFocused();

  /** Dispatch actions to the Redux store 
   * @memberof Map
   * @instance    
   */
  const dispatch = useDispatch();

  /**
   * Updates "selectedId" state
   * @param value - New value that will be assigned to the "selectedId" state
   * @memberof Map
   * @instance    
   */
  const updateSelectedId = (value) => {
    setSelectedId(value);
  }

  /**
   * Updates "isEdit" state
   * @param value - New value that will be assigned to the "isEdit" state
   * @memberof Map
   * @instance    
   */
  const updateIsEdit = (value) => {
    setIsEdit(value);
  }
  /**
   * Updates "isConfirm" state
   * @param value - New value that will be assigned to the "isConfirm" state
   * @memberof Map
   * @instance    
   */
  const updateIsConfirm = (value) => {
    setIsConfirm(value);
  }

  /**
   * Updates "isDelete" state
   * @param value - New value that will be assigned to the "isDelete" state
   * @memberof Map
   * @instance    
   */
  const updateIsDelete = (value) => {
    setIsDelete(value);
  }

  /**
   * Updates "showCarMarker" state
   * @param value - New value that will be assigned to the "showCarMarker" state
   * @memberof Map
   * @instance    
   */
  const updateShowCarMarker = (value) => {
    setShowCarMarker(value);
  }

  /**
   * The function retrieves the latitude, longitude, and radius of a circle object, with default values
   * if they are not provided.
   * @memberof Map
   * @instance    
   */
  const getCircle = () => {
    setCircle({
      latitude: device?.circle?.latitude ?? LATITUDE_DEFAULT,
      longitude: device?.circle?.longitude ?? LONGITUDE_DEFAULT,
      radius: device?.circle?.radius ?? 0,
    })
  }

  /**
   * This function updates the latitude and longitude properties of the position object with the values
   * from the device's position object, or sets them to null if they are not available.
   * @memberof Map
   * @instance    
   */
  const getPosition = () => {
    setPosition({
      ...position,
      latitude: device?.position?.latitude ?? null,
      longitude: device?.position?.longitude ?? null,
    });
  }

  /**
   * This function updates a circle object with a new value for a specified property.
   * @param name - name is a string parameter that represents the name of the property in the circle
   * object that needs to be updated.
   * @param value - The value that will be assigned to the property of the circle object with the key
   * specified by the name parameter.
   * @memberof Map
   * @instance    
   */
  const updateCircle = (name, value) => {
    setCircle(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  /* This is a cleanup function that is executed when the component unmounts or when the `isFocused`
  state variable changes */
  useEffect(() => {
    return () => {
      updateIsEdit(false);
      updateIsConfirm(false);
      updateIsDelete(false);
    }
  }, [isFocused]);

  /* This is a useEffect hook that is triggered whenever the `device` state variable changes */
  useEffect(() => {
    if (!isEdit && !isConfirm) {
      getCircle();
    }
    getPosition();
    //console.log("useEffec in map on [device]", device)
  }, [device]);

  /**
   * The function handles the edit button press.
   * @memberof Map
   * @instance    
   */
  const handleEditPress = () => {
    if (!isEdit && !isConfirm) {
      updateIsEdit(true);
    } else {
      getCircle();
      updateIsEdit(false);
      updateIsConfirm(false);
      updateIsDelete(false);
    }
  }

  /**
   * The function is used to handle edit button press in confirm menu
   * @memberof Map
   * @instance    
   */
  const handleEditPressConfirm = () => {
    updateIsEdit(true);
    updateIsConfirm(false);
    updateIsDelete(false);
  }

  /**
   * The function handles the cancel button press.
   * @memberof Map
   * @instance    
   */
  const handleCancelPress = () => {
    getCircle();
    updateIsConfirm(false)
    updateIsDelete(false);
  }

  /**
   * The function handles saving and updating the status of subscription request. It also changes the current circle. 
   * @memberof Map
   * @instance    
   */
  const handleSavePress = () => {
    //Subscribe request
    if (isDelete === false) {
      const requestSubscribeCode = 1;
      //Update Status and update Circle
      dispatch(editCircle({ requestKey: 'circle', status: requestSubscribeCode, circle: circle, id: selectedId }));
      ToastAndroid.show("Saved!", ToastAndroid.SHORT);
    }
    //Unsubscribe request 
    if (isDelete === true && device.requests.circle.status == 11) {
      const requestUnubscribeCode = 2;
      //Update Status only
      dispatch(editCircle({ requestKey: 'circle', status: requestUnubscribeCode, id: selectedId }));
      ToastAndroid.show("Saved!", ToastAndroid.SHORT);
    }
    updateIsConfirm(false);
    updateIsDelete(false);
  }

  /**
   * Animates map to the current position
   * @memberof Map
   * @instance    
   */
  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: position?.latitude,
      longitude: position?.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    })
  }

  /**
   * This function updates the latitude and longitude of a circle object based on an event parameter.
   * @param event - The `event` parameter is an object that contains latitude and longitude coordinates used 
   * to update the `latitude` and `longitude` properties of the `circle` object
   * @memberof Map
   * @instance    
   */
  const handlePress = (event) => {
    setCircle(prevState => ({
      ...prevState,
      latitude: event.latitude,
      longitude: event.longitude,
    }))
  }
  
  return (

    <View style={mapStyles.container}>

      <MapView style={mapStyles.map}

        provider={PROVIDER_GOOGLE}
        minZoomLevel={3}
        maxZoomLevel={16}
        customMapStyle={customMapStyle}

        initialRegion={{
          latitude: position?.latitude ?? LATITUDE_DEFAULT,
          longitude: position?.longitude ?? LONGITUDE_DEFAULT,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}

        ref={mapRef}
        toolbarEnabled={false}


        {...(isEdit ? { onPress: e => handlePress(e.nativeEvent.coordinate) } : {})}

      >

        {
          (showCarMarker && position?.latitude && position?.longitude) && <Marker
            onPress={onCenter}
            coordinate={{ latitude: position?.latitude, longitude: position?.longitude }}
           >
            <Image
            source={carMarker}
            style={{width: 60, height: 60}}
            resizeMode="contain"
            />
            </Marker>
        }

        {
          <Circle
            center={{ latitude: circle.latitude, longitude: circle.longitude }}
            radius={circle.radius}
            strokeColor={(device?.requests?.circle?.status == 11 && !isEdit && !isConfirm) ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)"}
            fillColor={(device?.requests?.circle?.status == 11 && !isEdit && !isConfirm) ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)"}
          />
        }

      </MapView>

      <FetchData/>

      <MapTopBar selectedId={selectedId} updateSelectedId={updateSelectedId} isFocused={isFocused} />

      <View style={mapStyles.botMenus}>

        {device && <MapMainMenu handleEditPress={handleEditPress}
          showCarMarker={showCarMarker} handleShowMarker={() => updateShowCarMarker(!showCarMarker)} />}
        {isEdit && <MapEditMenu updateCircle={updateCircle} circle={circle}
          updateIsEdit={updateIsEdit} updateIsConfirm={updateIsConfirm} updateIsDelete={updateIsDelete} />}
        {isConfirm && <MapConfirmMenu handleEditPress={handleEditPressConfirm} handleCancelPress={handleCancelPress} handleSavePress={handleSavePress} />}

      </View>

    </View>

      ); 

}

