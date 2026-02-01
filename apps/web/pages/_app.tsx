import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';
import { store } from '../src/store';
import type { RootState } from '../src/store';
import { loginSuccess } from '../src/store/slices/authActionCreators';
import { authApi } from '../src/services/api';
import { PageLoader } from '../src/components/ui';
import '../src/styles/globals.css';

// Handle Chrome extension errors gracefully
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    // Filter out Chrome extension errors
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('chrome-extension://')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

// Auth initializer component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success) {
            store.dispatch(loginSuccess(response.data));
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  if (isLoading) {
    return <PageLoader text="Loading Mercury..." />;
  }

  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Component {...pageProps} />
      </AuthInitializer>
    </Provider>
  );
}

export default MyApp;
