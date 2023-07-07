/** Module contains a Redux store configured using the `configureStore` function from the
 * `@reduxjs/toolkit` library. It also uses `redux-persist` to persist the state of the `savedDevices`
 * slice of the store to `AsyncStorage`. The `combineReducers` function is used to combine multiple
 * reducers into a single reducer function, and the `persistReducer` function is used to wrap the root
 * reducer with the persist configuration. The `store` and `persistor` variables are exported for use
 * in other parts of the application, and the `getDevices` function is exported to retrieve the
 * `savedDevices` slice of the store
 * @module ReduxStore
 */
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { savedDevicesReducer } from './ReduxDevices'
import { dataBaseReducer } from './ReduxDatabase';

const savedDevicesPersistConfig = {
  key: 'devices',
  storage: AsyncStorage,
  blacklist: ['devices']
}

const rootReducer = combineReducers({
  savedDevices: savedDevicesReducer,
  dataBase: dataBaseReducer,
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