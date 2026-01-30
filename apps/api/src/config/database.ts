import mongoose from 'mongoose';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const getMongoUri = (): string => {
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/mercury-investment';
};

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

export const connectDatabase = async (): Promise<void> => {
  try {
    const MONGODB_URI = getMongoUri();
    // #region agent log
    logDebug({location:'database.ts:12',message:'Connecting to MongoDB',data:{uri:MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/,'//***:***@')},sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });
    // #region agent log
    logDebug({location:'database.ts:17',message:'MongoDB connect succeeded',data:{readyState:mongoose.connection.readyState},sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // #region agent log
    logDebug({location:'database.ts:21',message:'MongoDB connection error',data:{errorType:error?.constructor?.name,errorMessage:error instanceof Error?error.message:String(error),code:(error as any)?.code},sessionId:'debug-session',runId:'run1',hypothesisId:'C'});
    // #endregion
    console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : error);
    console.error('💡 Tip: Make sure MongoDB is running or update MONGODB_URI in your .env file');
    // Re-throw error so caller can handle it
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};
