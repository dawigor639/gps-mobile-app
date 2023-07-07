import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text} from 'react-native';
import { historyStyles } from './Styles'
import Entypo from 'react-native-vector-icons/Entypo';
import { validateNumber } from './sharedValidation';

/**
 * Renders custom text input component that validates and updates user input based on
 * specified parameters
 * @function CustomTextInput
 * @param props - The component properties
 * @param props.name - The name of the input field
 * @param props.type - The type of the input field
 * @param props.maxLength- The maximum length of the input value
 * @param props.keyboardType - The keyboard type to be displayed on mobile devices
 * @param props.range - The range of values allowed for the input field
 * @param props.regex - The regular expression pattern to validate the input value
 * @param props.updateValue - A callback function to update the input value
 * @param props.passValue - A callback function to pass the input value to a parent component
 * @param props.secure - Determines whether the input value should be masked for sensitive data
 * @param props.updateValid - A callback function to update the validity state of the input value
 * @param props.visible - Determines whether the component should be visible
 * @returns {JSX.Element} The rendered custom text input component
 */
export default function CustomTextInput({ name, type = "string", maxLength = 60, keyboardType = "default", range, regex, updateValue, passValue, secure = false, updateValid, visible = true }) {
  /**
   * The function validates and updates a given text input based on its type and range.
   * @param text - The input text to be validated and updated.
   * @memberof CustomTextInput
   * @instance    
   */
  const validateAndUpdate = (text) => {
    let correct;
    let valid = false;

    switch (type) {
      case "double":
        valid = validateNumber(text, type, regex, range.min, range.max);
        if (valid)
          correct = parseFloat(text);
        break;
      case "int":
        valid = validateNumber(text, type, regex, range.min, range.max);
        if (valid)
          correct = parseInt(text);
        break;
      case "string":
        valid = regex.test(text);
        if (valid)
          correct = text;
        break;
      default:
        valid = regex.test(text);
        if (valid)
          correct = text;
    }

    if (valid) {
      updateState("valid", true);
      updateValid(true);
      updateValue(correct)
    }
    else {
      updateState("valid", false);
      updateValid(false);
    }
    updateState("value", text);
  }

  /* This is a `useEffect` hook that is triggered whenever the `passValue` prop changes. It calls the
  `validateAndUpdate` function with the `passValue` prop as an argument, which validates and updates
  the input value based on its type and range */
  useEffect(() => {
    validateAndUpdate(passValue ? passValue.toString() : "");
  }, [passValue])

  /** Object representing current state of component, it keeps information about value, focus 
   * data validity and character hiding 
   * @memberof CustomTextInput
   * @instance    
   */
  const [state, setState] = useState({
    value: "",
    valid: true,
    focus: false,
    hide: secure,
  })

  /**
   * The function updates the state object by setting a specific field to a given value.
   * @param field - The name of the field in the state object that needs to be updated.
   * @param value - The value that will be assigned to the specified field in the state object.
   * @memberof CustomTextInput
   * @instance    
   */
  const updateState = (field, value) => {
    setState(prevState => ({
      ...prevState,
      [field]: value
    }))
  }

  return (

    <View>
      {
        visible && <View>
          <Text style={historyStyles.text}>{name}</Text>
          <View style={historyStyles.passwordContainer}>

            <TextInput
              style={state.focus ? state.valid ? historyStyles.textInputFocus : historyStyles.textInputFocusInvalid :
                state.valid ? historyStyles.textInput : historyStyles.textInputInvalid}
              placeholder={name}
              keyboardType={keyboardType}
              onChangeText={(text) => validateAndUpdate(text)}
              onFocus={() => updateState("focus", true)}
              onBlur={() => updateState("focus", false)}
              defaultValue={state?.value ?? ""}
              maxLength={maxLength}
              secureTextEntry={state.hide}
            />

            {
              (secure === true) && <Pressable style={historyStyles.passwordHiddeIcon}
                onPress={() => updateState("hide", !state.hide)}
              >
                <Entypo name={state.hide ? "eye-with-line" : "eye"} />
              </Pressable>
            }
          </View>
        </View>
      }
    </View>

  )
}