import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  duration: 0,
  path: '',
  thumbnail: '',
  caption: '',
};

export const userSlice = createSlice({
  name: 'VIDEO',
  initialState,
  reducers: {
    update: (state, action) => {
      return {...action.payload, thumbnail: '', caption: ''};
    },
    addThumbnail: (state, action) => {
      return {...state, thumbnail: action.payload};
    },
    addCaption: (state, action) => {
      return {...state, caption: action.payload};
    },
  },
});

export const {update, addThumbnail, addCaption} = userSlice.actions;

export default userSlice.reducer;
