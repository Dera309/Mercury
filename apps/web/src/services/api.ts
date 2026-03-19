import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, Portfolio, MarketIndex, Stock, Sector, User, LoginCredentials, Transaction } from '../types';

// API Configuration
// In Next.js, NEXT_PUBLIC_ variables are baked in at build time.
// If this is 'localhost' on a public Render URL, it will fail due to CORS/Private Network Access.
// Resilience: Clean up trailing dots or slashes from the env var
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/[.\/]+$/, '');

if (typeof window !== 'undefined') {
  console.log('🚀 API Service Initialized');
  console.log('📍 Current Origin:', window.location.origin);
  console.log('📍 API_BASE_URL:', API_BASE_URL);
  
  if (window.location.hostname !== 'localhost' && API_BASE_URL.includes('localhost')) {
    console.warn('🚨 WARNING: You are running in production but your API URL is still set to localhost!');
    console.warn('💡 ACTION REQUIRED: Set NEXT_PUBLIC_API_URL in your Render Environment Variables to your API URL (e.g., https://mercury-api.onrender.com/api) and REBUILD your web service.');
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    console.log('Sending login request to:', API_BASE_URL + '/auth/login', 'with credentials:', credentials);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
      }
      throw error;
    }
  },

  register: async (data: LoginCredentials & { firstName: string; lastName: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    console.log('Sending register request to:', API_BASE_URL + '/auth/register', 'with data:', { ...data, password: '***' });
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          configUrl: error.config?.url,
          configBaseUrl: error.config?.baseURL
        });
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Portfolio API
export const portfolioApi = {
  getPortfolio: async (): Promise<ApiResponse<Portfolio>> => {
    const response = await apiClient.get('/portfolio');
    return response.data;
  },

  getHoldings: async (): Promise<ApiResponse<Portfolio['holdings']>> => {
    const response = await apiClient.get('/portfolio/holdings');
    return response.data;
  },

  getAssetAllocation: async (): Promise<ApiResponse<Portfolio['assets']>> => {
    const response = await apiClient.get('/portfolio/allocation');
    return response.data;
  },
};

// Market API
export const marketApi = {
  getIndices: async (): Promise<ApiResponse<MarketIndex[]>> => {
    const response = await apiClient.get('/market/indices');
    return response.data;
  },

  getStocks: async (symbols?: string[]): Promise<ApiResponse<Stock[]>> => {
    const params = symbols ? { symbols: symbols.join(',') } : {};
    const response = await apiClient.get('/market/stocks', { params });
    return response.data;
  },

  getSectors: async (): Promise<ApiResponse<Sector[]>> => {
    const response = await apiClient.get('/market/sectors');
    return response.data;
  },

  searchStocks: async (query: string): Promise<ApiResponse<Stock[]>> => {
    const response = await apiClient.get('/market/search', { params: { q: query } });
    return response.data;
  },

  getStockDetails: async (symbol: string): Promise<ApiResponse<Stock & { history: { date: string; price: number }[] }>> => {
    const response = await apiClient.get(`/market/stocks/${symbol}`);
    return response.data;
  },
};

// Trading API
export const tradingApi = {
  buyStock: async (symbol: string, shares: number): Promise<ApiResponse<{ transactionId: string }>> => {
    const response = await apiClient.post('/trading/buy', { symbol, shares });
    return response.data;
  },

  sellStock: async (symbol: string, shares: number): Promise<ApiResponse<{ transactionId: string }>> => {
    const response = await apiClient.post('/trading/sell', { symbol, shares });
    return response.data;
  },

  getTransactionHistory: async (): Promise<ApiResponse<Transaction[]>> => {
    const response = await apiClient.get('/trading/history');
    return response.data;
  },
};

export default apiClient;
