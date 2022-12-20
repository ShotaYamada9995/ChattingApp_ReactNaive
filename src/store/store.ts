import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// import logger from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Auth from './reducers/Auth';
import Login from './reducers/Login';
import User from './reducers/User';
import Video from './reducers/Video';
import InspiringVideos from './reducers/InspiringVideos';
import FollowingVideos from './reducers/FollowingVideos';
import Bookmarks from './reducers/Bookmarks';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['auth', 'inspiringVideos', 'followingVideos', 'video'],
};

const reducers = combineReducers({
  auth: Auth,
  login: Login,
  user: User,
  video: Video,
  inspiringVideos: InspiringVideos,
  followingVideos: FollowingVideos,
  bookmarks: Bookmarks,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
