import mongoose, { Document, Schema } from 'mongoose';

export interface IVerificationCode extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCode>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);
