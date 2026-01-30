import { Request, Response, NextFunction } from 'express';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface CustomError extends Error {
  statusCode?: number;
}

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

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // #region agent log
  logDebug({location:'errorHandler.ts:19',message:'Error handler invoked',data:{statusCode:err?.statusCode,message:err?.message,path:req?.path,method:req?.method},sessionId:'debug-session',runId:'run1',hypothesisId:'A'});
  // #endregion
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
