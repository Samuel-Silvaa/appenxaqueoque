import {  configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import appReducer from './reducers/app.reducer';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer
  },
});

// 👇 export typed dispatch and state
export type AppDispatch = typeof store.dispatch;
export const useAsyncAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;