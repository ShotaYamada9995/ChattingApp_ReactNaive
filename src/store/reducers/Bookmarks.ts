import {createSlice} from '@reduxjs/toolkit';

const initialState: any[] = [];

export const userSlice = createSlice({
  name: 'BOOKMARKS',
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      return [...state, action.payload];
    },
    removeBookmark: (state, action) => {
      return state.filter(video => video.id !== action.payload.id);
    },
  },
});

export const {addBookmark, removeBookmark} = userSlice.actions;

export default userSlice.reducer;
