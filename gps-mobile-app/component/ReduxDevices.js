/** Module contains a Redux slice for managing a list of saved devices. It uses
 * the `createSlice` function from the `@reduxjs/toolkit` library to create the slice, which includes
 * the initial state, reducers for adding, editing, and deleting devices, and thunks for dispatching
 * actions to add or delete devices from a database. The `addDeviceThunk` and `delDeviceThunk` thunks
 * dispatch both the `add` or `del` action from the slice and the `addDevice` or `delDevice` action
 * from the `ReduxDatabase` module. The slice also includes reducers for editing device properties and
 * requests 
 * @module ReduxDevices
 */
import { createSlice } from '@reduxjs/toolkit'
import { addDevice, delDevice } from './ReduxDatabase'

const initialState = [];

//Thunk calls add from savedDevices and addDevice from Database
export const addDeviceThunk = (payload) => (dispatch) => {
  dispatch(add(payload));
  dispatch(addDevice());
};

//Thunk calls del from savedDevices and delDevice from Database
export const delDeviceThunk = (payload) => (dispatch) => {
  dispatch(del(payload));
  dispatch(delDevice(payload));
};

const savedDevicesSlice = createSlice({
  name: 'savedDevices',
  initialState,
  reducers: {
    add: (state, action) => {
      const newArray = [...state,
      {
        id: state.length ? state[state.length - 1].id + 1 : 1,
        name: action.payload.name, address: action.payload.address, password: action.payload.password,
        position: { latitude: null, longitude: null, time: null },
        circle: { latitude: 52.0, longitude: 19.0, radius: 0 },
        interval: 120,
        requests: {
          position: { requestId: null, requestTime: null, status: 1 },
          circle: { requestId: null, requestTime: null, status: 21 },
        }
      }
      ];
      console.log("add return: ", newArray);
      return newArray;
    },
    edit: (state, action) => {
      const newArray = state.map(elem => {
        if (elem.id === action.payload.id) {
          return { ...elem, ...action.payload };
        }
        return elem;
      });
      console.log("edit return: ", newArray);
      return newArray;
    },
    del: (state, action) => {
      let newArray = state.filter(elem => (elem.id !== action.payload));
      let newId = 0;
      newArray = newArray.map(elem => {
        return { ...elem, id: ++newId };
      });
      console.log("del return: ", newArray);
      return newArray;
    },
    editRequests: (state, action) => {
      const { id, requestKey, ...requestProp } = action.payload;
      //console.log("log:",id,requestKey);
      const newArray = state.map(elem => {
        if (elem.id === id) {
          return {
            ...elem,
            requests: {
              ...elem.requests,
              [requestKey]: { ...elem.requests[requestKey], ...requestProp },
            }
          }
        };
        return elem;
      });
      console.log("log:", newArray[0].requests);
      return newArray;
    },
    editCircle: (state, action) => {
      const { id, requestKey, circle, ...requestProp } = action.payload;
      //console.log("log:",id,requestKey);
      const newArray = state.map(elem => {
        if (elem.id === id) {
          return {
            ...elem,
            circle: circle ?? elem.circle,
            requests: {
              ...elem.requests,
              [requestKey]: { ...elem.requests[requestKey], ...requestProp },
            }
          }
        };
        return elem;
      });
      console.log("log:", newArray[0].requests);
      return newArray;
    },
  },
})

export const { add, edit, del, editRequests, editCircle } = savedDevicesSlice.actions;

export const savedDevicesReducer = savedDevicesSlice.reducer;
