import { MarketIndex, Stock, Sector } from '../../types';

// Action Types
const FETCH_MARKET_DATA_REQUEST = 'market/FETCH_MARKET_DATA_REQUEST';
const FETCH_MARKET_DATA_SUCCESS = 'market/FETCH_MARKET_DATA_SUCCESS';
const FETCH_MARKET_DATA_FAILURE = 'market/FETCH_MARKET_DATA_FAILURE';
const UPDATE_STOCK_PRICE = 'market/UPDATE_STOCK_PRICE';

// State Interface
interface MarketState {
  indices: MarketIndex[];
  stocks: Stock[];
  sectors: Sector[];
  isLoading: boolean;
  error: string | null;
}

// Action Interfaces
interface FetchMarketDataRequestAction {
  type: typeof FETCH_MARKET_DATA_REQUEST;
}

interface FetchMarketDataSuccessAction {
  type: typeof FETCH_MARKET_DATA_SUCCESS;
  payload: {
    indices: MarketIndex[];
    stocks: Stock[];
    sectors: Sector[];
  };
}

interface FetchMarketDataFailureAction {
  type: typeof FETCH_MARKET_DATA_FAILURE;
  payload: string;
}

interface UpdateStockPriceAction {
  type: typeof UPDATE_STOCK_PRICE;
  payload: {
    symbol: string;
    price: number;
    change: number;
  };
}

type MarketAction =
  | FetchMarketDataRequestAction
  | FetchMarketDataSuccessAction
  | FetchMarketDataFailureAction
  | UpdateStockPriceAction;

// Initial State
const initialState: MarketState = {
  indices: [],
  stocks: [],
  sectors: [],
  isLoading: false,
  error: null,
};

// Reducer
const marketReducer = (
  state = initialState,
  action: MarketAction
): MarketState => {
  switch (action.type) {
    case FETCH_MARKET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_MARKET_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        indices: action.payload.indices,
        stocks: action.payload.stocks,
        sectors: action.payload.sectors,
        error: null,
      };
    case FETCH_MARKET_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case UPDATE_STOCK_PRICE:
      return {
        ...state,
        stocks: state.stocks.map((stock) =>
          stock.symbol === action.payload.symbol
            ? {
                ...stock,
                price: action.payload.price,
                change: action.payload.change,
              }
            : stock
        ),
      };
    default:
      return state;
  }
};

// Action Creators
export const fetchMarketDataRequest = (): FetchMarketDataRequestAction => ({
  type: FETCH_MARKET_DATA_REQUEST,
});

export const fetchMarketDataSuccess = (data: {
  indices: MarketIndex[];
  stocks: Stock[];
  sectors: Sector[];
}): FetchMarketDataSuccessAction => ({
  type: FETCH_MARKET_DATA_SUCCESS,
  payload: data,
});

export const fetchMarketDataFailure = (
  error: string
): FetchMarketDataFailureAction => ({
  type: FETCH_MARKET_DATA_FAILURE,
  payload: error,
});

export const updateStockPrice = (
  symbol: string,
  price: number,
  change: number
): UpdateStockPriceAction => ({
  type: UPDATE_STOCK_PRICE,
  payload: { symbol, price, change },
});

export default marketReducer;
