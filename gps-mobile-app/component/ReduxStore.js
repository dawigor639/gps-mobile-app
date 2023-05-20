import { configureStore } from '@reduxjs/toolkit'
import {persistStore,persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
//import thunk from 'redux-thunk';
//import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { savedDevicesReducer } from './ReduxDevices'
import { dataBaseReducer } from './ReduxDatabase';


const savedDevicesPersistConfig = {
  key: 'devices',
  storage: AsyncStorage,
  blacklist: ['devices']
}

const rootReducer = combineReducers({
  savedDevices: savedDevicesReducer,
  dataBase:  dataBaseReducer,
});

const persistedReducer = persistReducer(savedDevicesPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export const getDevices = async () => {
  return store.getState().savedDevices;
};