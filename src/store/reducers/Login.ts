import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  resumeScreen: 'Main',
};

export const userSlice = createSlice({
  name: 'LOGIN',
  initialState,
  reducers: {
    update: (state, action) => {
      return {resumeScreen: action.payload};
    },
  },
});

export const {update} = userSlice.actions;

export default userSlice.reducer;
