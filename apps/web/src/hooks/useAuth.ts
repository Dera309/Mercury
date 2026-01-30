import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import { loginRequest, loginSuccess, loginFailure, logout as logoutAction } from '../store/slices/authActionCreators';
import { authApi } from '../services/api';
import { LoginCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(loginRequest());
        const response = await authApi.login(credentials);
        if (response.success) {
          localStorage.setItem('token', response.data.token);
          dispatch(loginSuccess(response.data.user));
          router.push('/portfolio');
        } else {
          dispatch(loginFailure(response.message || 'Login failed'));
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          dispatch(loginFailure(err.message));
        } else {
          dispatch(loginFailure('An error occurred'));
        }
      }
    },
    [dispatch, router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with logout even if API call fails
    }
    dispatch(logoutAction());
    router.push('/auth/login');
  }, [dispatch, router]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      const response = await authApi.getCurrentUser();
      if (response.success) {
        dispatch(loginSuccess(response.data));
        return true;
      }
    } catch {
      localStorage.removeItem('token');
    }
    return false;
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };
};

export default useAuth;
