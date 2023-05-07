import React , {useState, useEffect} from 'react';
import { View, TextInput , Pressable , Text, Keyboard } from 'react-native';
import { settingsStyles } from './Styles'
import Entypo from 'react-native-vector-icons/Entypo';
import {validateNumber} from './sharedValidation';

export default function CustomTextInput(  {name, type="string", maxLength=60, keyboardType="default", range, regex , updateValue , passValue , secure=false, updateValid, visible=true} ) {
  


  const validateAndUpdate = (text) => {
    let correct;
    let valid=false;

    switch (type) {
      case "double":
        valid=validateNumber(text,type,regex,range.min,range.max);
        if (valid) 
          correct=parseFloat(text);
        break;     
      case "int":
        valid=validateNumber(text,type,regex,range.min,range.max);
        if (valid)
          correct=parseInt(text);  
        break;
      case "string": 
        valid=regex.test(text);
        if (valid)
          correct=text;
        break;
      default:
        valid=regex.test(text);
        if (valid)
          correct=text;
      }
      
    if(valid)
    {
    updateState("valid",true);
    updateValid(true);
    updateValue(correct)
    }
    else {
      updateState("valid",false);
      updateValid(false);
    }
    updateState("value",text); 
  }

  useEffect( () => {   
    validateAndUpdate(passValue ? passValue.toString() : ""); 
   }, [passValue])

  const [state, setState] = useState( {
    value: "",
    valid: true,
    focus: false,
    hide: secure,
  })

  const updateState = (field,value) => {
    setState(prevState => ({
      ...prevState,
      [field]: value
    })) 
  }

return  (

        <View> 
             {
             visible  &&  <View> 
            <Text style={settingsStyles.text}>{name}</Text>
            <View style={settingsStyles.passwordContainer}>

            <TextInput 
              style={ state.focus ? state.valid ? settingsStyles.textInputFocus : settingsStyles.textInputFocusInvalid: 
              state.valid ? settingsStyles.textInput : settingsStyles.textInputInvalid }
              placeholder={name}
              keyboardType={keyboardType}
              onChangeText={ (text) => validateAndUpdate(text)}
              onFocus={() => updateState("focus",true) }
              onBlur={() => updateState("focus",false) }
              defaultValue={state?.value ?? ""}
              maxLength={maxLength}
              secureTextEntry={state.hide}
            />

            {
            (secure===true) && <Pressable style={settingsStyles.passwordHiddeIcon} 
             onPress={ () => updateState("hide",!state.hide)}
            >
            <Entypo  name = {state.hide ? "eye-with-line" : "eye"} /> 
            </Pressable>
            }
            </View>
            </View>
            }
        </View>
    
)
}