import { configureStore } from '@reduxjs/toolkit'
import { savedDevicesReducer } from './ReduxDevices'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

const reducers = combineReducers({
  savedDevices: savedDevicesReducer,
});

const persistConfig = {
  key: 'devices',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export const persistor = persistStore(store)

export const getDevices = async () => {
  return store.getState().savedDevices;
};