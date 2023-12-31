import {createSlice} from '@reduxjs/toolkit';

const initialState: any[] = [];

export const userSlice = createSlice({
  name: 'FOR_YOU_VIDEOS',
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
            inspired_count: video.inspired_count + 1,
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
            inspired_count: video.inspired_count - 1,
          };
        } else {
          return video;
        }
      });

      return newState;
    },
    incrementViewCount: (state, action) => {
      const newState = state.map(video => {
        if (video._id === action.payload.id) {
          return {
            ...video,
            playcounts: video.playcounts + 1,
          };
        } else {
          return video;
        }
      });
      return newState;
    },
  },
});

export const {addVideos, likeVideo, unlikeVideo, incrementViewCount} =
  userSlice.actions;

export default userSlice.reducer;
