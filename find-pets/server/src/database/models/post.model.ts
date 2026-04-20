import mongoose, { Schema, Document } from 'mongoose';
import { PostStatus } from '../../modules/posts/types/post.types';

export interface IPost extends Document {
  title: string;
  description?: string;
  status: PostStatus;
  isResolved: boolean;
  address?: string;
  resolvedAt?: Date;
  createdAt: Date;
  userIds: mongoose.Types.ObjectId[];
  petId?: mongoose.Types.ObjectId;
  phone?: string;
  foundPetInfo?: {
    type?: string;
    breed?: string;
    colors?: string[];
    photos?: string[];
    size?: string;
    description?: string;
  };
  locationId: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 2000 },
    status: { type: String, enum: Object.values(PostStatus), required: true },
    isResolved: { type: Boolean, default: false },
    address: { type: String },
    resolvedAt: { type: Date },
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    petId: { type: Schema.Types.ObjectId, ref: 'Pet' },
    phone: { type: String, trim: true, required: true },
    foundPetInfo: {
      type: { type: String },
      breed: { type: String },
      colors: { type: [String] },
      photos: { type: [String] },
      size: { type: String },
      description: { type: String },
    },
    locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
