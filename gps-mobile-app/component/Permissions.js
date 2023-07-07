/** 
 * Module contains exported functions for handling and checking SMS permissions in a React Native app on
 * an Android device
 * @module Permissions 
 */
import React from 'react'
import { PermissionsAndroid } from 'react-native';

/**
 * This function handles SMS permissions in a React Native app by checking and requesting permissions
 * for reading and sending SMS messages.
 * @memberof Permissions 
 */
export async function handleSmsPermissions() {
  const permissionsArray = [PermissionsAndroid.PERMISSIONS.READ_SMS, PermissionsAndroid.PERMISSIONS.SEND_SMS];
  if (!(await checkPermissions(permissionsArray))) {
    await requestPermissions(permissionsArray);
  }
}

/**
 * The function checks for SMS permissions in an Android device.
 * @returns Promise that resolves to a boolean value indicating whether the specified
 * permissions have been granted or not
 * @memberof Permissions 
 */
export async function checkSmsPermissions() {
  const permissionsArray = [PermissionsAndroid.PERMISSIONS.READ_SMS, PermissionsAndroid.PERMISSIONS.SEND_SMS];
  return await checkPermissions(permissionsArray);
}

/**
 * Checks if permissions are granted on an Android device.
 * @param permissionsArray - Array of permission strings that need to be checked using the
 * PermissionsAndroid module in a React Native app.
 * @returns Boolean value indicating whether the permissions in the `permissionsArray` have been
 * granted or not.
 * @memberof Permissions 
 */
async function checkPermissions(permissionsArray) {
  let hasPermissions = false;
  try {
    for (const elem of permissionsArray) {
      hasPermissions = await PermissionsAndroid.check(elem);
      if (!hasPermissions)
        break;
    }
  } catch (e) {
    return false;
  }
  //console.log("permissionsArray: ", permissionsArray);
  //console.log("retrun: ", hasPermissions);
  return hasPermissions;
}

/**
 * The function checks if all values in an object are "granted" and returns true if they are.
 * @param granted - The parameter `granted` is an object that contains keys and values representing
 * permissions or access levels
 * @returns Returns `true` if all the values in the `granted` object are equal to the string "granted", and `false` otherwise.
 * @memberof Permissions 
 */
const logicAnd = (granted) => {
  for (const key of Object.keys(granted)) {
    if (!(granted[key] === "granted"))
      return false;
  }
  return true
}

/**
 * The function requests multiple permissions in Android
 * @param permissionsArray - an array of strings representing the permissions that the app is
 * requesting from the user
 * @memberof Permissions 
 */
async function requestPermissions(permissionsArray) {
  let granted = {};
  try {
    console.log("requesting permissions");
    granted = await PermissionsAndroid.requestMultiple(permissionsArray);
    console.log(granted);

    if (logicAnd(granted)) {
      console.log("You can use app now");
    } else {
      console.log("permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}
