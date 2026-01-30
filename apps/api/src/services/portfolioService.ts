import Holding from '../models/Portfolio';
import { Portfolio, Holding as HoldingType } from '../types';

// Mock market data service - in production, this would fetch from a real market data API
export const getCurrentStockPrice = async (symbol: string): Promise<{ price: number; change: number }> => {
  // Mock data - replace with real API call
  const mockPrices: Record<string, { price: number; change: number }> = {
    AAPL: { price: 175.50, change: 2.5 },
    GOOGL: { price: 142.30, change: -1.2 },
    MSFT: { price: 378.90, change: 5.3 },
    AMZN: { price: 145.20, change: -0.8 },
    TSLA: { price: 245.60, change: 12.4 },
  };

  return mockPrices[symbol] || { price: 100, change: 0 };
};

const getStockName = (symbol: string): string => {
  const names: Record<string, string> = {
    AAPL: 'Apple Inc.',
    GOOGL: 'Alphabet Inc.',
    MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
  };
  return names[symbol] || symbol;
};

export const getUserPortfolio = async (userId: string): Promise<Portfolio> => {
  const holdings = await Holding.find({ userId });

  let totalValue = 0;
  let totalCost = 0;
  const holdingsWithPrices: HoldingType[] = [];

  // Calculate portfolio value and holdings
  for (const holding of holdings) {
    const marketData = await getCurrentStockPrice(holding.symbol);
    const currentValue = holding.shares * marketData.price;
    const costBasis = holding.shares * holding.averagePrice;
    const gain = currentValue - costBasis;
    const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;

    totalValue += currentValue;
    totalCost += costBasis;

    holdingsWithPrices.push({
      symbol: holding.symbol,
      name: getStockName(holding.symbol),
      shares: holding.shares,
      price: marketData.price,
      value: currentValue,
      change: gainPercent,
    });
  }

  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  // Calculate asset allocation (simplified - grouping by stock types)
  const assets = holdingsWithPrices.map((holding, index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return {
      name: holding.symbol,
      value: holding.value,
      color: colors[index % colors.length],
      percentage: totalValue > 0 ? (holding.value / totalValue) * 100 : 0,
    };
  });

  return {
    totalValue,
    totalGain,
    totalGainPercent,
    assets,
    holdings: holdingsWithPrices,
  };
};

export const getUserHoldings = async (userId: string): Promise<HoldingType[]> => {
  const portfolio = await getUserPortfolio(userId);
  return portfolio.holdings;
};

export const getUserAssetAllocation = async (userId: string) => {
  const portfolio = await getUserPortfolio(userId);
  return portfolio.assets;
};
