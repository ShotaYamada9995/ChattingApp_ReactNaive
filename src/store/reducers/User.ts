import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loginExpiryDate: 0,
};

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    login: (state, action) => {
      return {...action.payload, isLoggedIn: true};
    },
  },
});

export const {login} = userSlice.actions;

export default userSlice.reducer;
