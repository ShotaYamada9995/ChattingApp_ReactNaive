import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    update: state => {
      state.isLoggedIn = true;
    },
  },
});

export const {update} = userSlice.actions;

export default userSlice.reducer;
