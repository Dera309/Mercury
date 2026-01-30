import { Request, Response, NextFunction } from 'express';
import { ApiResponse, Portfolio } from '../types';

// Mock portfolio data for testing without database
const mockPortfolio: Portfolio = {
  totalValue: 125750.50,
  totalGain: 5750.50,
  totalGainPercent: 4.8,
  assets: [
    { name: 'Stocks', value: 85000, color: '#007bff', percentage: 67.6 },
    { name: 'Bonds', value: 25000, color: '#28a745', percentage: 19.9 },
    { name: 'Real Estate', value: 10000, color: '#ffc107', percentage: 8.0 },
    { name: 'Commodities', value: 5750.50, color: '#dc3545', percentage: 4.5 },
  ],
  holdings: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 100,
      price: 175.50,
      value: 17550,
      change: 2.3,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 50,
      price: 142.25,
      value: 7112.50,
      change: -1.2,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 75,
      price: 380.75,
      value: 28556.25,
      change: 3.1,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      shares: 25,
      price: 245.80,
      value: 6145,
      change: -2.8,
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      shares: 60,
      price: 155.30,
      value: 9318,
      change: 1.5,
    },
  ],
};

// Mock transactions data
const mockTransactions = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'buy',
    shares: 100,
    price: 170.00,
    total: 17000.00,
    date: '2024-01-15',
  },
  {
    id: '2',
    symbol: 'GOOGL',
    type: 'buy',
    shares: 50,
    price: 140.00,
    total: 7000.00,
    date: '2024-01-20',
  },
  {
    id: '3',
    symbol: 'MSFT',
    type: 'buy',
    shares: 75,
    price: 375.00,
    total: 28125.00,
    date: '2024-02-01',
  },
  {
    id: '4',
    symbol: 'TSLA',
    type: 'buy',
    shares: 25,
    price: 250.00,
    total: 6250.00,
    date: '2024-02-10',
  },
  {
    id: '5',
    symbol: 'AMZN',
    type: 'buy',
    shares: 60,
    price: 150.00,
    total: 9000.00,
    date: '2024-02-15',
  },
];

export const mockGetPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response: ApiResponse<Portfolio> = {
      success: true,
      data: mockPortfolio,
      message: 'Portfolio retrieved successfully (mock mode)',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const mockGetHoldings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response: ApiResponse<typeof mockPortfolio.holdings> = {
      success: true,
      data: mockPortfolio.holdings,
      message: 'Holdings retrieved successfully (mock mode)',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const mockGetAssetAllocation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response: ApiResponse<typeof mockPortfolio.assets> = {
      success: true,
      data: mockPortfolio.assets,
      message: 'Asset allocation retrieved successfully (mock mode)',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const mockGetTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response: ApiResponse<typeof mockTransactions> = {
      success: true,
      data: mockTransactions,
      message: 'Transactions retrieved successfully (mock mode)',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
