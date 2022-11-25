import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  email: '',
  otp: '',
  password: '',
  firstname: '',
  lastname: '',
  community: '',
  expertise: [],
};

export const userSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    update: (state, action) => {
      return {...state, ...action.payload};
    },
  },
});

export const {update} = userSlice.actions;

export default userSlice.reducer;
