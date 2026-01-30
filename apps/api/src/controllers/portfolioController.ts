import { Request, Response, NextFunction } from 'express';
import { ApiResponse, Portfolio } from '../types';
import {
  getUserPortfolio,
  getUserHoldings,
  getUserAssetAllocation,
} from '../services/portfolioService';
import { CustomError } from '../middlewares/errorHandler';

export const getPortfolio = async (
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

    const portfolio = await getUserPortfolio(req.user.userId);

    const response: ApiResponse<Portfolio> = {
      success: true,
      data: portfolio,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getHoldings = async (
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

    const holdings = await getUserHoldings(req.user.userId);

    const response: ApiResponse<typeof holdings> = {
      success: true,
      data: holdings,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAssetAllocation = async (
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

    const allocation = await getUserAssetAllocation(req.user.userId);

    const response: ApiResponse<typeof allocation> = {
      success: true,
      data: allocation,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
