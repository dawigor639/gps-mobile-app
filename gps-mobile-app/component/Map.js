import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions , Text, ToastAndroid } from 'react-native';
import MapView, { Marker, AnimatedRegion , Circle , PROVIDER_GOOGLE }  from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native'; ////


import { mapStyles , customMapStyle } from './Styles';
import MapMainMenu from  './MapMainMenu';
import MapEditMenu from  './MapEditMenu';
import MapConfirmMenu from  './MapConfirmMenu';
import MapTopBar from  './MapTopBar';
import FetchData from './FetchData';

import {radiusRange, LATITUDE_DEFAULT, LONGITUDE_DEFAULT} from './sharedValues';

import { useSelector, useDispatch } from 'react-redux'
import { editCircle, editRequests } from './ReduxDevices'

const carMarker = require('./../img/carMarkerSmall.png');

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.003;  
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Map() {
  
  const mapRef = useRef()

  const [position, setPosition] = useState({
      latitude: null,          
      longitude: null,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
  })
  const [circle, setCircle] = useState({
    latitude: LATITUDE_DEFAULT, 
    longitude:  LONGITUDE_DEFAULT,
    radius: 0,
  })
  const [selectedId, setSelectedId] = useState(1); 
  const [isEdit, setIsEdit] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isDelete, setIsDelete] = useState(false);
  const [showCarMarker, setShowCarMarker] = useState(true)

  const device = useSelector((state) => state.savedDevices?.find(elem => elem.id === selectedId));
  const dispatch = useDispatch();

  const updateSelectedId = (value) => {
      setSelectedId(value);
  } 

  const updateIsEdit = (value) => {
      setIsEdit(value);
    }
  const updateIsConfirm = (value) => {
      setIsConfirm(value);
    }

  const updateIsDelete = (value) => {
      setIsDelete(value);
    }

  const updateShowCarMarker = (value) => {
    setShowCarMarker(value);
    }

  const getCircle = () => {
    setCircle({
      latitude: device?.circle?.latitude ?? LATITUDE_DEFAULT,
      longitude: device?.circle?.longitude ?? LONGITUDE_DEFAULT,
      radius: device?.circle?.radius ?? 0,
    })
  }

  const getPosition = ()  => {
    setPosition({
    ...position,
    latitude: device?.position?.latitude ?? null,
    longitude: device?.position?.longitude ?? null,
    });
} 

  const updateCircle = (name,value) => {
    setCircle(prevState => ({
      ...prevState,
      [name]: value
    })) 
  }

const isFocused = useIsFocused();

//Cleanup
useEffect(() => {
  return () => {
    updateIsEdit(false);
    updateIsConfirm(false);
    updateIsDelete(false);
  }
}, [isFocused]);

//Used to get new circle and position if changed by fetchData component
useEffect(() => {
  if (!isEdit && !isConfirm) {
    getCircle(); 
  }
  getPosition(); 
  //console.log("useEffec in map on [device]", device)
}, [device]);

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

const handleEditPressConfirm = () => {
    updateIsEdit(true);
    updateIsConfirm(false);
    updateIsDelete(false);
}

const handleCancelPress = () => {
  getCircle();
  updateIsConfirm(false)
  updateIsDelete(false);
}

const handleSavePress = () => {
  //Subscribe request
  if (isDelete===false) {
    const requestSubscribeCode = 1;
    //Update Status and update Circle
    dispatch(editCircle({requestKey: 'circle', status: requestSubscribeCode, circle: circle, id: selectedId}));  
    ToastAndroid.show("Saved!", ToastAndroid.SHORT);
  }
  //Unsubscribe request 
  if (isDelete===true && device.requests.circle.status==11 ) {
    const requestUnubscribeCode = 2;
    //Update Status only
    dispatch(editCircle({requestKey: 'circle', status: requestUnubscribeCode, id: selectedId}));  
    ToastAndroid.show("Saved!", ToastAndroid.SHORT);
  }
  updateIsConfirm(false);
  updateIsDelete(false);
}

const onCenter = () => {
  mapRef.current.animateToRegion({
      latitude: position?.latitude,
      longitude: position?.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
  })
}

const handlePress = (event) => {  
  setCircle(prevState => ({
    ...prevState,
    latitude: event.latitude,
    longitude: event.longitude,
  }))
}

const changeRegion = (region) => {  
    region=({
      latitude: position?.latitude,
      longitude: position?.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    })   
}

  const animateCamera = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({center: { latitude, longitude, }, pitch: 0, heading: 0, zoom: 18,}, {duration: 1000});
    }
  }

  //getLiveLocation();
  //<Text style ={{position: 'absolute'}}> { Math.round((new Date()).getTime() / 1000) - 1667164310/*state.time*/} </Text>
  //FetchData(); /////TEST TEST TEST TEST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<Text>{"wynik:\n"} {userQueries[0].dataUpdatedAt}</Text>
  //<FetchData/>

  return (

    <View style={mapStyles.container}>

                <MapView style={mapStyles.map}

                 provider={PROVIDER_GOOGLE}
                 minZoomLevel={3}   
                 maxZoomLevel={16}
                 customMapStyle={customMapStyle}
                
                 initialRegion={{
                    latitude: position?.latitude,
                    longitude: position?.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                   }}
                   
                    ref={mapRef}
                    toolbarEnabled={false}
                     
     
                     {...(isEdit ? { onPress: e => handlePress(e.nativeEvent.coordinate)} : {})}

                    >

                    {
                    (showCarMarker && position?.latitude && position?.longitude) && <Marker
                    onPress={onCenter}
                    coordinate={{latitude: position?.latitude, longitude: position?.longitude}}
                    image={carMarker}
                    />
                    }

                    {
                    <Circle 
                    center= {{latitude: circle.latitude, longitude: circle.longitude}}
                    radius= {circle.radius}
                    strokeColor = {(device?.requests?.circle?.status==11 && !isEdit && !isConfirm) ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)"}
                    fillColor = {(device?.requests?.circle?.status==11 && !isEdit && !isConfirm) ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)"}
                    />
                    }
                    
                     </MapView>
                    

                     <FetchData/>


                    <MapTopBar selectedId={selectedId} updateSelectedId={updateSelectedId} isFocused={isFocused} /> 
                    
                    <View style={mapStyles.botMenus}>

                    {device && <MapMainMenu handleEditPress = { handleEditPress } 
                     showCarMarker={showCarMarker}  handleShowMarker={ () => updateShowCarMarker(!showCarMarker)}/>}
                    {isEdit && <MapEditMenu updateCircle={updateCircle} circle={circle} 
                    updateIsEdit={updateIsEdit} updateIsConfirm={updateIsConfirm} updateIsDelete={updateIsDelete}/>}
                    {isConfirm &&  <MapConfirmMenu handleEditPress={handleEditPressConfirm} handleCancelPress={handleCancelPress} handleSavePress={handleSavePress}/> }
                    
                    </View>


            </View>
            
  );
 }

 