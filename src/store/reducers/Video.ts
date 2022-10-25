import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  duration: 0,
  path: '',
};

export const userSlice = createSlice({
  name: 'VIDEO',
  initialState,
  reducers: {
    update: (state, action) => {
      return action.payload;
    },
  },
});

export const {update} = userSlice.actions;

export default userSlice.reducer;
