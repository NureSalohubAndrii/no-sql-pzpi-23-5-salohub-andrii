import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  type: string;
  coordinates: number[];
  description?: string;
}

const LocationSchema = new Schema<ILocation>({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true },
  description: { type: String },
});

LocationSchema.index({ location: '2dsphere' });

export default mongoose.model<ILocation>('Location', LocationSchema);
