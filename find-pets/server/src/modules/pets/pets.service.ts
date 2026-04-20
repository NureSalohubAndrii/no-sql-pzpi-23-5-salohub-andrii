import mongoose from 'mongoose';
import Pet from '../../database/models/pet.model';
import UserPets from '../../database/models/user-pets.model';
import Post from '../../database/models/post.model';
import { AppError } from '../../shared/utils/error.utils';
import { generateCode } from '../../shared/utils/generate-code.utils';
import { GetMyPetsParams, CreateOrUpdatePetData } from './types/pet.types';
import { SortOrder } from '../../shared/types/common.types';
import { PostSortBy } from '../posts/types/post.types';

export const getMyPets = async (
  userId: string,
  {
    page = 1,
    limit = 6,
    search,
    petType,
    petSize,
    sortBy = PostSortBy.CreatedAt,
    sortOrder = SortOrder.DESC,
  }: GetMyPetsParams
) => {
  const userPets = await UserPets.findOne({ userId });
  if (!userPets || userPets.petIds.length === 0) {
    return { data: [], total: 0, page, totalPages: 0 };
  }

  const filter: Record<string, any> = {
    _id: { $in: userPets.petIds },
  };
  const conditions: Record<string, any>[] = [];

  if (petType) {
    filter.type = petType;
  }
  if (petSize) {
    filter.size = petSize;
  }

  if (search) {
    conditions.push({
      $or: [
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (conditions.length > 0) {
    filter.$and = conditions;
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Pet.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('activePostsCount')
      .populate('ownersCount'),
    Pet.countDocuments(filter),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
};

export const addPetByCode = async (userId: string, code: string) => {
  const pet = await Pet.findOne({ code });

  if (!pet) {
    throw new AppError('Pet not found', 404);
  }

  await UserPets.findOneAndUpdate({ userId }, { $addToSet: { petIds: pet._id } }, { upsert: true });
  await Post.updateMany({ petId: pet._id, isResolved: false }, { $addToSet: { userIds: userId } });

  return pet;
};

export const createPet = async (userId: string, data: CreateOrUpdatePetData) => {
  const code = await generateCode();

  const pet = await Pet.create({ ...data, code });

  await UserPets.findOneAndUpdate({ userId }, { $addToSet: { petIds: pet._id } }, { upsert: true });

  return pet;
};

export const deletePet = async (userId: string, petId: string) => {
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    throw new AppError('Invalid pet id', 400);
  }

  const userPets = await UserPets.findOne({ userId });

  if (!userPets?.petIds.includes(new mongoose.Types.ObjectId(petId))) {
    throw new AppError('Pet not found in your list', 404);
  }

  await UserPets.updateOne({ userId }, { $pull: { petIds: petId } });
  await Post.updateMany({ petId, isResolved: false }, { $pull: { userIds: userId } });

  const otherOwners = await UserPets.find({ petIds: petId });
  if (otherOwners.length === 0) {
    await Pet.findByIdAndDelete(petId);
    await Post.deleteMany({ petId });
  }

  return { success: true };
};

export const updatePet = async (
  userId: string,
  petId: string,
  data: Partial<CreateOrUpdatePetData>
) => {
  if (!mongoose.Types.ObjectId.isValid(petId)) {
    throw new AppError('Invalid pet id', 400);
  }

  const userPets = await UserPets.findOne({ userId });
  const hasPet = userPets?.petIds.some(id => id.toString() === petId);

  if (!hasPet) {
    throw new AppError('Pet not found in your list or you do not have permission', 403);
  }

  const updatedPet = await Pet.findByIdAndUpdate(
    petId,
    { $set: data },
    { new: true, runValidators: true }
  )
    .populate('activePostsCount')
    .populate('ownersCount');

  if (!updatedPet) {
    throw new AppError('Pet not found', 404);
  }

  return updatedPet;
};
