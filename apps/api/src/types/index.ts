// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

// Portfolio Types
export interface AssetAllocation {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  value: number;
  change: number;
}

export interface Portfolio {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  assets: AssetAllocation[];
  holdings: Holding[];
}

// Market Types
export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changeValue: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
}

export interface Sector {
  name: string;
  change: number;
  color: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}
