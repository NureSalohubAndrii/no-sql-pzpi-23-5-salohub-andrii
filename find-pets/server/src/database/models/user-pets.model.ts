import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPets extends Document {
  userId: mongoose.Types.ObjectId;
  petIds: mongoose.Types.ObjectId[];
}

const UserPetsSchema = new Schema<IUserPets>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  petIds: { type: [Schema.Types.ObjectId], ref: 'Pet', default: [] },
});

export default mongoose.model<IUserPets>('UserPets', UserPetsSchema);
