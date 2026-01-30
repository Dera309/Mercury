import { User } from '../../types';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SET_USER,
  LoginRequestAction,
  LoginSuccessAction,
  LoginFailureAction,
  LogoutAction,
  SetUserAction,
} from './authAction';

export const loginRequest = (): LoginRequestAction => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (user: User): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});
