import React , { useState , useEffect} from 'react';
import NavContainer from './component/NavContainer';
import {handleSmsPermissions} from './component/Permissions';

import { store, persistor } from './component/ReduxStore'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {

  useEffect(() => {
    handleSmsPermissions();
  }, []);
  
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavContainer/>
        </PersistGate>
      </Provider>
    );
}