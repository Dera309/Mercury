import { Request, Response, NextFunction } from 'express';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ApiResponse, User as UserType } from '../types';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { CustomError } from '../middlewares/errorHandler';

// Debug logging helper
const logDebug = (data: any) => {
  try {
    // Path from workspace root - go up from apps/api to root (mercury11)
    const workspaceRoot = join(process.cwd(), '..', '..');
    const logDir = join(workspaceRoot, '.cursor');
    const logPath = join(logDir, 'debug.log');
    // Ensure directory exists
    try {
      mkdirSync(logDir, { recursive: true });
    } catch (e) {
      // Directory might already exist, ignore
    }
    const logEntry = JSON.stringify({...data, timestamp: Date.now()}) + '\n';
    appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) {
    // Silently fail - don't crash the server if logging fails
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // #region agent log
  logDebug({location:'authController.ts:18',message:'Register handler entered',data:{hasBody:!!req.body,hasEmail:!!req.body?.email},sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
  // #endregion
  try {
    const { user, token } = await registerUser(req.body);
    // #region agent log
    logDebug({location:'authController.ts:21',message:'Register success',data:{userId:user?.id},sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion

    const response: ApiResponse<{ user: UserType; token: string }> = {
      success: true,
      data: { user, token },
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    // #region agent log
    logDebug({location:'authController.ts:30',message:'Register error caught',data:{errorType:error?.constructor?.name,errorMessage:error instanceof Error?error.message:String(error)},sessionId:'debug-session',runId:'run1',hypothesisId:'B'});
    // #endregion
    const customError: CustomError = error as CustomError;
    customError.statusCode = 400;
    next(customError);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, token } = await loginUser(req.body);

    const response: ApiResponse<{ user: UserType; token: string }> = {
      success: true,
      data: { user, token },
      message: 'Login successful',
    };

    res.status(200).json(response);
  } catch (error) {
    // If database is not available, provide a mock response for development
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('MongoDB') || errorMessage.includes('connection')) {
      console.log('Database not available, using mock response for login');

      // Mock user data
      const mockUser: UserType = {
        id: '1',
        email: req.body.email,
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      const response: ApiResponse<{ user: UserType; token: string }> = {
        success: true,
        data: { user: mockUser, token: mockToken },
        message: 'Login successful (mock mode - database not available)',
      };

      res.status(200).json(response);
    } else {
      const customError: CustomError = error as CustomError;
      customError.statusCode = 401;
      next(customError);
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // In a real application, you might want to invalidate the token
    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Logout successful',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
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

    const user = await getUserById(req.user.userId);
    if (!user) {
      const error: CustomError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const response: ApiResponse<UserType> = {
      success: true,
      data: user,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
