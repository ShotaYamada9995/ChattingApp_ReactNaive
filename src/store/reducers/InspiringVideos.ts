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
    followUser: (state, action) => {
      const newState = state.map(video => {
        if (video._id === action.payload.id) {
          return {
            ...video,
            user: {
              ...video.user,
              followers: [...video.user.followers, action.payload.userData],
            },
          };
        } else {
          return video;
        }
      });

      return newState;
    },
    unfollowUser: (state, action) => {
      const newState = state.map(video => {
        if (video._id === action.payload.id) {
          return {
            ...video,
            user: {
              ...video.user,
              followers: video.user.followers.filter(
                (follower: any) =>
                  follower.userSlug !== action.payload.userSlug,
              ),
            },
          };
        } else {
          return video;
        }
      });

      return newState;
    },
  },
});

export const {addVideos, likeVideo, unlikeVideo, followUser, unfollowUser} =
  userSlice.actions;

export default userSlice.reducer;
