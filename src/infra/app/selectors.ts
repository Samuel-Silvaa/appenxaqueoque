import { AuthReducer } from './reducers/auth.reducer'; 
export const authSelector = (state: any) : AuthReducer => state.auth;