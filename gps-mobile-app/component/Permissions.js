import React from 'react'
import { PermissionsAndroid} from 'react-native';

export async function handleSmsPermissions () {
    const permissionsArray=[PermissionsAndroid.PERMISSIONS.READ_SMS,PermissionsAndroid.PERMISSIONS.SEND_SMS];
    if ( !(await checkPermissions(permissionsArray)) ) {
        await requestPermissions(permissionsArray);
    }
}

export async function checkSmsPermissions() {
  const permissionsArray=[PermissionsAndroid.PERMISSIONS.READ_SMS,PermissionsAndroid.PERMISSIONS.SEND_SMS];
  return await checkPermissions(permissionsArray);
}

/*
export async function handleStoragePermissions () {
  const permissionsArray=[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];
  if ( !(await checkPermissions(permissionsArray)) ) {
      await requestPermissions(permissionsArray)
  }
}

export async function checkStoragePermissions() {
  const permissionsArray=[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];
  return await checkPermissions(permissionsArray);
}
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
    console.log(hasPermissions);
    return hasPermissions;
}

const logicAnd = (granted) => { 
  for (const key of Object.keys(granted)) {
  if(!(granted[key]==="granted"))
      return false;
  }
  return true
}

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