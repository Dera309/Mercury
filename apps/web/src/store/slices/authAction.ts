import { User } from '../../types';

export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
export const LOGOUT = 'auth/LOGOUT';
export const SET_USER = 'auth/SET_USER';

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  [key: string]: unknown;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User;
  [key: string]: unknown;
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
  [key: string]: unknown;
}

export interface LogoutAction {
  type: typeof LOGOUT;
  [key: string]: unknown;
}

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
  [key: string]: unknown;
}

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | SetUserAction;
