import React, {useState, useEffect, useContext} from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = [];


//requests: [{requestId: null, requestTime: null}, {requestId: null, requestTime: null}]

const savedDevicesSlice = createSlice({
  name: 'savedDevices',
  initialState,
  reducers: {
    add: (state,action) => {
      const newArray = [...state, 
        {id: state.length ? state[state.length-1].id+1 : 1, 
        name: action.payload.name, address: action.payload.address, password: action.payload.password, 
        position: {latitude:null, longitude:null, time:null}, 
        circle: {latitude:52.0, longitude:19.0, radius:0},
        interval: 120,
        requests: {
                  position: {requestId: null, requestTime: null, status: 1},
                  circle:   {requestId: null, requestTime: null, status: 21},
                  } 
        }
        ];
        return newArray;
    },
    edit: (state,action) => {
      const newArray = state.map(elem => {
        if (elem.id === action.payload.id) {
          return {...elem, ...action.payload};
        }
        return elem;
      });
      return newArray;
    },
    del: (state, action) => {
      let newArray = state.filter(elem => (elem.id !== action.payload) );
      let newId=0;
      newArray = newArray.map(elem => {
          return {...elem, id: ++newId};
      });
      return newArray;
    },
    editRequests: (state, action) => {
      const { id, ...request } = action.payload;
      //console.log("log:",id,request);
      const newArray = state.map(elem => {
        if (elem.id === id) {
          return {...elem, 
            requests: {
              ...elem.requests,
              ...request,
              } 
          }
        };
        return elem;
      });
      console.log("log:",newArray[0].requests);
      return newArray;
    },
  },
})

export const {get, add, edit, del, editRequests} = savedDevicesSlice.actions;

export const savedDevicesReducer = savedDevicesSlice.reducer;
