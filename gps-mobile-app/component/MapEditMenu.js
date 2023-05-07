import React , {useState , useEffect } from 'react';
import { View, Text } from 'react-native';
import { mapStyles, settingsStyles } from './Styles'
import CustomTextInput from './CustomTextInput';
import CustomSwitch from './CustomSwitch';
import CustomButton from './CustomButton';
import {LATITUDE_REGEX, LONGITUDE_REGEX, RADIUS_REGEX} from './sharedValidation';
import {latitudeRange, longitudeRange, radiusRange} from './sharedValues';


export default function MapEditMenu( { updateCircle , circle , updateIsEdit , updateIsConfirm, updateIsDelete } ) {

  const [switchSetting, setSwitchSetting] = useState(false)
  const [valid, setValid] = useState( 
    {
      radius: true,
      latitude: true,
      longitude: true
    }
   )

  const updateValid = (name,value) => {
    setValid(prevState => ({
      ...prevState,
    [name]: value
  }))
  }

  const updateSwitchSetting = (value) => {
    setSwitchSetting(value);
  }

  const handleConfirm= () => {
    updateIsEdit(false);
    updateIsConfirm(true);
  }

  const handleDelete= () => {
    updateIsDelete(true);
    handleConfirm();
  }
 

    return (
      <View style={mapStyles.editMenu} > 

        <View style={mapStyles.rowButtonsContainer}>

          <View style={mapStyles.rowButton} >
            <CustomSwitch name={"Radius"} value={!switchSetting} handleOnPress={() => updateSwitchSetting(false)} />
          </View>

          <View style={mapStyles.rowButton}> 
            <CustomSwitch name={"Center"} value={switchSetting} handleOnPress={() => updateSwitchSetting(true)} />

          </View>

        </View>

            <View>
            <CustomTextInput name={"Radius"} type={"int"} maxLength={7} keyboardType={"numeric"} range={radiusRange} regex={RADIUS_REGEX} updateValue={(val) => updateCircle("radius",val)} passValue={circle.radius} updateValid={(val) => updateValid("radius",val)} visible={!switchSetting} />
            </View>

            <View>
            <CustomTextInput name={"Latitude"} type={"double"} maxLength={18} keyboardType={"numeric"} range={latitudeRange} regex={LATITUDE_REGEX} updateValue={(val) => updateCircle("latitude",val)} passValue={circle.latitude} updateValid={(val) => updateValid("latitude",val)} visible={switchSetting} />
            </View>
          
            <View>
            <CustomTextInput name={"Longitude"} type={"double"} maxLength={18} keyboardType={"numeric"} range={longitudeRange} regex={LONGITUDE_REGEX} updateValue={(val) => updateCircle("longitude",val)} passValue={circle.longitude} updateValid={(val) => updateValid("longitude",val)} visible={switchSetting} />
            </View>  
        

        {/*<View style = {mapStyles.menuElement}>
          <CustomButton name={"Confirm"} handleOnPress={handleConfirm} disable={!(valid.radius&&valid.longitude&&valid.latitude)} />
    </View>   */}

          <View style={mapStyles.rowButtonsContainer}>

            <View style={mapStyles.rowButton} >
              <CustomButton name={"Delete"} handleOnPress={handleDelete} />
            </View>

            <View style={mapStyles.rowButton}> 
              <CustomButton name={"Confirm"} handleOnPress={handleConfirm} disable={!(valid.radius&&valid.longitude&&valid.latitude)} />
            </View>

          </View>

        </View>
      
    )
  }
