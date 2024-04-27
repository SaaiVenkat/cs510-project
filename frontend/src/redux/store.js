import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const initialState = {
  isLoggedIn: false,
  accessToken: null,
  tokenExpiration: null,
  userAvatar: null,
};
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        tokenExpiration: action.payload.expiration,
        userAvatar: action.payload.userAvatar,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};
const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, loginReducer);
const store = configureStore({
  reducer: {
    login: persistedReducer,
  },
});
const persistor = persistStore(store);
export { store, persistor };