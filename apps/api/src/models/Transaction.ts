import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'buy' | 'sell';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    shares: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for user transactions
TransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
