
/** Module contains Redux slice created using the `createSlice` function from the `@reduxjs/toolkit`
 * package. The slice is named `dataBase` and has an initial state of an empty array. It also defines
 * three reducer functions: `addDevice`, `addRecord`, and `delDevice`. These reducers modify the state
 * of the slice in response to actions dispatched to the Redux store. Finally, the code exports the
 * reducer function and the action creators for the slice
 * @module ReduxDatabase
 */
import { createSlice } from '@reduxjs/toolkit'

const maxSize = 5000;
const initialState = [];

const dataBaseSlice = createSlice({
  name: 'dataBase',
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const newArray = [...state,
      {
        id: state.length ? state[state.length - 1].id + 1 : 1,
        currentIndex: 0,
        smsRecords: [],
      }
      ];
      return newArray;
    },
    addRecord: (state, action) => {

      const newArray = state.map(elem => {
        //adding new sms only
        if (action.payload.record.date <= elem.smsRecords[elem.currentIndex - 1]?.date)
          return elem;
        if (elem.id === action.payload.id) {
          return {
            ...elem,
            currentIndex: (elem.currentIndex + 1) % maxSize,
            smsRecords: [
              ...elem.smsRecords.slice(0, elem.currentIndex),
              action.payload.record,
              ...elem.smsRecords.slice(elem.currentIndex + 1)
            ]
          };
        }
        return elem;
      });
      return newArray;
    },
    delDevice: (state, action) => {
      let newArray = state.filter(elem => (elem.id !== action.payload));
      let newId = 0;
      newArray = newArray.map(elem => {
        return { ...elem, id: ++newId };
      });
      return newArray;
    },
  },
})

export const { addDevice, delDevice, addRecord } = dataBaseSlice.actions;

export const dataBaseReducer = dataBaseSlice.reducer;
