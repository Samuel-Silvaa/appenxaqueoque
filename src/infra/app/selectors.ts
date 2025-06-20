import { AppReducer } from "./reducers/app.reducer";
import { AuthReducer } from './reducers/auth.reducer'; 

export const authSelector = (state: any) : AuthReducer => state.auth;

export const appStateSelector = (state: any) : AppReducer => state.app;