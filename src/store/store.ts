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
import User from './reducers/User';
import Video from './reducers/Video';
import InspiringVideos from './reducers/InspiringVideos';
import Bookmarks from './reducers/Bookmarks';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['auth', 'ínspiringVideos'],
};

const reducers = combineReducers({
  auth: Auth,
  user: User,
  video: Video,
  inspiringVideos: InspiringVideos,
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
