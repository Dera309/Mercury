import Holding from '../models/Portfolio';
import Transaction from '../models/Transaction';
import { getCurrentStockPrice } from './portfolioService';
import mongoose from 'mongoose';

export const buyStock = async (
  userId: string,
  symbol: string,
  shares: number
): Promise<{ transactionId: string }> => {
  const marketData = await getCurrentStockPrice(symbol);
  const price = marketData.price;
  const total = shares * price;

  // Create transaction
  const transaction = new Transaction({
    userId: new mongoose.Types.ObjectId(userId),
    type: 'buy',
    symbol: symbol.toUpperCase(),
    shares,
    price,
    total,
    status: 'completed',
  });

  await transaction.save();

  // Update or create holding
  let holding = await Holding.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    symbol: symbol.toUpperCase(),
  });

  if (holding) {
    // Update existing holding - calculate new average price
    const totalShares = holding.shares + shares;
    const totalCost = holding.shares * holding.averagePrice + total;
    holding.averagePrice = totalCost / totalShares;
    holding.shares = totalShares;
  } else {
    // Create new holding
    holding = new Holding({
      userId: new mongoose.Types.ObjectId(userId),
      symbol: symbol.toUpperCase(),
      name: symbol, // In production, fetch actual company name
      shares,
      averagePrice: price,
    });
  }

  await holding.save();

  return { transactionId: transaction._id.toString() };
};

export const sellStock = async (
  userId: string,
  symbol: string,
  shares: number
): Promise<{ transactionId: string }> => {
  // Check if user has enough shares
  const holding = await Holding.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    symbol: symbol.toUpperCase(),
  });

  if (!holding || holding.shares < shares) {
    throw new Error('Insufficient shares to sell');
  }

  const marketData = await getCurrentStockPrice(symbol);
  const price = marketData.price;
  const total = shares * price;

  // Create transaction
  const transaction = new Transaction({
    userId: new mongoose.Types.ObjectId(userId),
    type: 'sell',
    symbol: symbol.toUpperCase(),
    shares,
    price,
    total,
    status: 'completed',
  });

  await transaction.save();

  // Update holding
  holding.shares -= shares;
  if (holding.shares === 0) {
    await Holding.deleteOne({ _id: holding._id });
  } else {
    await holding.save();
  }

  return { transactionId: transaction._id.toString() };
};

export const getTransactionHistory = async (userId: string) => {
  const transactions = await Transaction.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .limit(50);

  return transactions.map((transaction) => ({
    id: transaction._id.toString(),
    type: transaction.type,
    symbol: transaction.symbol,
    shares: transaction.shares,
    price: transaction.price,
    total: transaction.total,
    date: transaction.createdAt.toISOString(),
    status: transaction.status,
  }));
};
