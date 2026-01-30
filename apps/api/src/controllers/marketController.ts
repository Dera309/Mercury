import { Request, Response, NextFunction } from 'express';
import { ApiResponse, MarketIndex, Stock, Sector } from '../types';
import {
  getMarketIndices,
  getStocks,
  getStockBySymbol,
  searchStocks,
  getSectors,
} from '../services/marketService';
import { CustomError } from '../middlewares/errorHandler';

export const getIndices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const indices = await getMarketIndices();

    const response: ApiResponse<MarketIndex[]> = {
      success: true,
      data: indices,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getStocksList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const symbols = req.query.symbols
      ? (req.query.symbols as string).split(',')
      : undefined;

    const stocks = await getStocks(symbols);

    const response: ApiResponse<Stock[]> = {
      success: true,
      data: stocks,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getStockDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { symbol } = req.params;
    const stock = await getStockBySymbol(symbol);

    const response: ApiResponse<typeof stock> = {
      success: true,
      data: stock,
    };

    res.status(200).json(response);
  } catch (error) {
    const customError: CustomError = error as CustomError;
    customError.statusCode = 404;
    next(customError);
  }
};

export const searchStocksList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      const error: CustomError = new Error('Search query is required');
      error.statusCode = 400;
      throw error;
    }

    const stocks = await searchStocks(q);

    const response: ApiResponse<Stock[]> = {
      success: true,
      data: stocks,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getSectorsList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sectors = await getSectors();

    const response: ApiResponse<Sector[]> = {
      success: true,
      data: sectors,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
