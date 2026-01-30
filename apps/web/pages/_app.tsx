import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import type { RootState } from '../src/store';
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
