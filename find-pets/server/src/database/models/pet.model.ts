import mongoose, { Schema, Document } from 'mongoose';
import { PetSize, PetType } from '../../modules/pets/types/pet.types';

export interface IPet extends Document {
  type: PetType;
  breed?: string;
  colors: string[];
  photos: string[];
  size: PetSize;
  description?: string;
  code: string;
}

const PetSchema = new Schema<IPet>(
  {
    type: { type: String, enum: Object.values(PetType), required: true },
    breed: { type: String },
    colors: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    size: { type: String, enum: Object.values(PetSize) },
    description: { type: String, maxlength: 1000 },
    code: { type: String, required: true, unique: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PetSchema.virtual('activePostsCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'petId',
  count: true,
  match: { isResolved: false },
});

PetSchema.virtual('ownersCount', {
  ref: 'UserPets',
  localField: '_id',
  foreignField: 'petIds',
  count: true,
});

export default mongoose.model<IPet>('Pet', PetSchema);
