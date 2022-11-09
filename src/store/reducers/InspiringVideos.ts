import {createSlice} from '@reduxjs/toolkit';

const initialState: any[] = [];

export const userSlice = createSlice({
  name: 'INSPIRING_VIDEOS',
  initialState,
  reducers: {
    addVideos: (state, action) => {
      return state.concat(action.payload);
    },
    likeVideo: (state, action) => {
      const newState = state.map(video => {
        if (video._id === action.payload.id) {
          return {
            ...video,
            inspired: [...video.inspired, action.payload.username],
          };
        } else {
          return video;
        }
      });
      return newState;
    },
    unlikeVideo: (state, action) => {
      const newState = state.map(video => {
        if (video._id === action.payload.id) {
          return {
            ...video,
            inspired: video.inspired.filter(
              (username: string) => action.payload.username !== username,
            ),
          };
        } else {
          return video;
        }
      });
      return newState;
    },
  },
});

export const {addVideos} = userSlice.actions;

export default userSlice.reducer;
