import { MarketIndex, Stock, Sector } from '../types';

// Mock market data - in production, these would fetch from real market data APIs
export const getMarketIndices = async (): Promise<MarketIndex[]> => {
  // Mock indices data
  return [
    {
      name: 'S&P 500',
      symbol: 'SPX',
      value: 4567.23,
      change: 1.2,
      changeValue: 54.12,
    },
    {
      name: 'Dow Jones',
      symbol: 'DJI',
      value: 34567.89,
      change: 0.8,
      changeValue: 276.54,
    },
    {
      name: 'NASDAQ',
      symbol: 'IXIC',
      value: 14234.56,
      change: 2.1,
      changeValue: 293.45,
    },
  ];
};

export const getStocks = async (symbols?: string[]): Promise<Stock[]> => {
  // Mock stocks data
  const allStocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.50,
      change: 1.4,
      volume: '45.2M',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.30,
      change: -0.8,
      volume: '32.1M',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.90,
      change: 1.5,
      volume: '28.5M',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 145.20,
      change: -0.5,
      volume: '52.3M',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 245.60,
      change: 5.2,
      volume: '89.7M',
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      price: 312.45,
      change: 2.3,
      volume: '41.6M',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 485.20,
      change: 3.1,
      volume: '67.8M',
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      price: 156.78,
      change: -0.3,
      volume: '15.2M',
    },
  ];

  if (symbols && symbols.length > 0) {
    return allStocks.filter((stock) => symbols.includes(stock.symbol));
  }

  return allStocks;
};

export const getStockBySymbol = async (symbol: string): Promise<Stock & { history: { date: string; price: number }[] }> => {
  const stocks = await getStocks([symbol]);
  const stock = stocks.find((s) => s.symbol === symbol.toUpperCase());

  if (!stock) {
    throw new Error(`Stock with symbol ${symbol} not found`);
  }

  // Generate mock price history (last 30 days)
  const history = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * 10;
    history.push({
      date: date.toISOString().split('T')[0],
      price: stock.price + variation,
    });
  }

  return {
    ...stock,
    history,
  };
};

export const searchStocks = async (query: string): Promise<Stock[]> => {
  const allStocks = await getStocks();
  const lowerQuery = query.toLowerCase();

  return allStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
  );
};

export const getSectors = async (): Promise<Sector[]> => {
  // Mock sectors data
  return [
    { name: 'Technology', change: 2.5, color: '#3B82F6' },
    { name: 'Finance', change: 0.8, color: '#10B981' },
    { name: 'Healthcare', change: 1.2, color: '#F59E0B' },
    { name: 'Consumer', change: -0.5, color: '#EF4444' },
    { name: 'Energy', change: 3.2, color: '#8B5CF6' },
    { name: 'Industrial', change: 1.8, color: '#EC4899' },
  ];
};
