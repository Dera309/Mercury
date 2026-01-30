import { Portfolio, Holding } from '../../types';

// Action Types
const FETCH_PORTFOLIO_REQUEST = 'portfolio/FETCH_PORTFOLIO_REQUEST';
const FETCH_PORTFOLIO_SUCCESS = 'portfolio/FETCH_PORTFOLIO_SUCCESS';
const FETCH_PORTFOLIO_FAILURE = 'portfolio/FETCH_PORTFOLIO_FAILURE';
const UPDATE_HOLDING = 'portfolio/UPDATE_HOLDING';

// State Interface
interface PortfolioState {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
}

// Action Interfaces
interface FetchPortfolioRequestAction {
  type: typeof FETCH_PORTFOLIO_REQUEST;
}

interface FetchPortfolioSuccessAction {
  type: typeof FETCH_PORTFOLIO_SUCCESS;
  payload: Portfolio;
}

interface FetchPortfolioFailureAction {
  type: typeof FETCH_PORTFOLIO_FAILURE;
  payload: string;
}

interface UpdateHoldingAction {
  type: typeof UPDATE_HOLDING;
  payload: Holding;
}

type PortfolioAction =
  | FetchPortfolioRequestAction
  | FetchPortfolioSuccessAction
  | FetchPortfolioFailureAction
  | UpdateHoldingAction;

// Initial State
const initialState: PortfolioState = {
  portfolio: null,
  isLoading: false,
  error: null,
};

// Reducer
const portfolioReducer = (
  state = initialState,
  action: PortfolioAction
): PortfolioState => {
  switch (action.type) {
    case FETCH_PORTFOLIO_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_PORTFOLIO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        portfolio: action.payload,
        error: null,
      };
    case FETCH_PORTFOLIO_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case UPDATE_HOLDING:
      if (!state.portfolio) return state;
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          holdings: state.portfolio.holdings.map((h) =>
            h.symbol === action.payload.symbol ? action.payload : h
          ),
        },
      };
    default:
      return state;
  }
};

// Action Creators
export const fetchPortfolioRequest = (): FetchPortfolioRequestAction => ({
  type: FETCH_PORTFOLIO_REQUEST,
});

export const fetchPortfolioSuccess = (
  portfolio: Portfolio
): FetchPortfolioSuccessAction => ({
  type: FETCH_PORTFOLIO_SUCCESS,
  payload: portfolio,
});

export const fetchPortfolioFailure = (
  error: string
): FetchPortfolioFailureAction => ({
  type: FETCH_PORTFOLIO_FAILURE,
  payload: error,
});

export const updateHolding = (holding: Holding): UpdateHoldingAction => ({
  type: UPDATE_HOLDING,
  payload: holding,
});

export default portfolioReducer;
