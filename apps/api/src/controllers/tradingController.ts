import { Request, Response, NextFunction } from 'express';
import { ApiResponse, Transaction } from '../types';
import { buyStock, sellStock, getTransactionHistory } from '../services/tradingService';
import { CustomError } from '../middlewares/errorHandler';

export const buy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const error: CustomError = new Error('User not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const { symbol, shares } = req.body;

    if (!symbol || !shares || shares <= 0) {
      const error: CustomError = new Error('Invalid symbol or shares');
      error.statusCode = 400;
      throw error;
    }

    const result = await buyStock(req.user.userId, symbol, shares);

    const response: ApiResponse<{ transactionId: string }> = {
      success: true,
      data: result,
      message: 'Stock purchased successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const sell = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const error: CustomError = new Error('User not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const { symbol, shares } = req.body;

    if (!symbol || !shares || shares <= 0) {
      const error: CustomError = new Error('Invalid symbol or shares');
      error.statusCode = 400;
      throw error;
    }

    const result = await sellStock(req.user.userId, symbol, shares);

    const response: ApiResponse<{ transactionId: string }> = {
      success: true,
      data: result,
      message: 'Stock sold successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const error: CustomError = new Error('User not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const transactions = await getTransactionHistory(req.user.userId);

    const response: ApiResponse<Transaction[]> = {
      success: true,
      data: transactions,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
