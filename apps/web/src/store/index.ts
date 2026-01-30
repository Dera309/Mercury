import { createStore, combineReducers, applyMiddleware, Store, compose } from 'redux';
import { thunk } from 'redux-thunk';

import authReducer from './slices/authSlice';
import portfolioReducer from './slices/portfolioSlice';
import marketReducer from './slices/marketSlice';

// Root state type
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  portfolio: ReturnType<typeof portfolioReducer>;
  market: ReturnType<typeof marketReducer>;
}

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
  market: marketReducer,
});

// Create store
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export const store: Store<RootState> = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export type AppDispatch = typeof store.dispatch;

export default store;
