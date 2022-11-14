import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  duration: 0,
  path: '',
  thumbnail: '',
  mime: '',
};

export const userSlice = createSlice({
  name: 'VIDEO',
  initialState,
  reducers: {
    update: (state, action) => {
      return {...action.payload};
    },
    addThumbnail: (state, action) => {
      return {...state, thumbnail: action.payload};
    },
  },
});

export const {update, addThumbnail} = userSlice.actions;

export default userSlice.reducer;
