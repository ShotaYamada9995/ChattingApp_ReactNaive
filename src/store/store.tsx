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

import UserReducer from './reducers/UserReducer';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const reducers = combineReducers({
  user: UserReducer,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }), // '.concat(logger) to add logger
});

export const persistor = persistStore(store);
