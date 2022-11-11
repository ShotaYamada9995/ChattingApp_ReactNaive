import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  loginExpiryDate: 0,
  following: [],
};

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    login: (state, action) => {
      return {...state, ...action.payload, isLoggedIn: true};
    },
    addFollowers: (state, action) => {
      return {...state, following: action.payload};
    },
    followUser: (state, action) => {
      return {...state, following: [...state.following, action.payload]};
    },
    unfollowUser: (state, action) => {
      return {
        ...state,
        following: state.following.filter(
          user => user.following !== action.payload.userSlug,
        ),
      };
    },
  },
});

export const {login, addFollowers, followUser, unfollowUser} =
  userSlice.actions;

export default userSlice.reducer;
