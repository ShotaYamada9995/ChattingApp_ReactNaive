import {createSlice} from '@reduxjs/toolkit';

interface BookmarkProps {
  id: string;
  video: string;
  thumbnail: string;
  caption: string;
  inspiredCount: number;
  user: {
    id: string;
    slug: string;
    image: string;
    firstname: string;
    lastname: string;
  };
}

const initialState: BookmarkProps[] = [];

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
