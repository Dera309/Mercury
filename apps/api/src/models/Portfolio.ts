import mongoose, { Schema, Document } from 'mongoose';

export interface IHolding extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const HoldingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
      min: 0,
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and symbol
HoldingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model<IHolding>('Holding', HoldingSchema);
