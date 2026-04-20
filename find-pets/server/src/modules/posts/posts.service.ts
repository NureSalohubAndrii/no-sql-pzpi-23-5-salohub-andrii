import { SortOrder } from '../../shared/types/common.types';
import {
  CreatePostData,
  GetPostsParams,
  PostSortBy,
  PostStatus,
  UpdatePostData,
} from './types/post.types';
import Post from '../../database/models/post.model';
import Pet from '../../database/models/pet.model';
import Location from '../../database/models/location.model';
import UserPets from '../../database/models/user-pets.model';
import { AppError } from '../../shared/utils/error.utils';
import mongoose from 'mongoose';
import { generateCode } from '../../shared/utils/generate-code.utils';

export const getPosts = async ({
  page = 1,
  limit = 8,
  search,
  status,
  petType,
  sortBy = PostSortBy.CreatedAt,
  sortOrder = SortOrder.DESC,
  petSize,
  lon,
  lat,
  radius,
}: GetPostsParams) => {
  const filter: Record<string, any> = {
    isResolved: false,
  };
  const conditions: Record<string, any>[] = [];

  if (status) {
    filter.status = status;
  }

  if (search) {
    conditions.push({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (lat && lon && radius) {
    const nearbyLocations = await Location.find({
      coordinates: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $maxDistance: radius * 1000,
        },
      },
    }).select('_id');

    const locationIds = nearbyLocations.map(location => location._id);

    filter.locationId = { $in: locationIds };
  }

  if (conditions.length > 0) {
    filter.$and = conditions;
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  if (petType || petSize) {
    const pipeline = [
      {
        $lookup: {
          from: 'pets',
          localField: 'petId',
          foreignField: '_id',
          as: 'petData',
        },
      },
      { $unwind: { path: '$petData', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          ...filter,
          $and: [
            ...(conditions.length > 0 ? conditions : [{}]),
            ...(petType
              ? [
                  {
                    $or: [{ 'foundPetInfo.type': petType }, { 'petData.type': petType }],
                  },
                ]
              : []),
            ...(petSize
              ? [
                  {
                    $or: [{ 'foundPetInfo.size': petSize }, { 'petData.size': petSize }],
                  },
                ]
              : []),
          ],
        },
      },
    ];

    const countPipeline = [...pipeline, { $count: 'count' }];
    const dataPipeline = [
      ...pipeline,
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'locationId',
        },
      },
      { $unwind: { path: '$locationId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'userIds',
          foreignField: '_id',
          as: 'authors',
        },
      },
      {
        $addFields: {
          petId: '$petData',
          userIds: {
            $map: {
              input: '$authors',
              as: 'u',
              in: { fullName: '$$u.fullName', email: '$$u.email', _id: '$$u._id' },
            },
          },
        },
      },
    ];

    const [data, countResult] = await Promise.all([
      Post.aggregate(dataPipeline),
      Post.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.count ?? 0;

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  if (conditions.length > 0) {
    filter.$and = conditions;
  }

  const [data, total] = await Promise.all([
    Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('petId')
      .populate('locationId')
      .populate('userIds', 'fullName email'),
    Post.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getPostById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid post id', 400);
  }

  const post = await Post.findById(id)
    .populate('locationId')
    .populate('petId')
    .populate('userIds', 'fullName email');

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

export const createPost = async (userId: string, data: CreatePostData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let petId = data.petId;

    if (!petId && data.newPet && data.status === PostStatus.Lost) {
      const [pet] = await Pet.create(
        [
          {
            ...data.newPet,
            photos: data.newPet.photos ?? [],
            code: await generateCode(),
          },
        ],
        { session }
      );

      await UserPets.findOneAndUpdate(
        { userId },
        { $addToSet: { petIds: pet._id } },
        { upsert: true, session }
      );

      petId = pet._id.toString();
    }

    const [location] = await Location.create(
      [
        {
          type: data.location.locationType,
          coordinates: data.location.coordinates,
          description: data.location.description,
        },
      ],
      { session }
    );

    const postPhotos =
      data.status === PostStatus.Lost
        ? (data.newPet?.photos ?? [])
        : (data.foundPetInfo?.photos ?? []);

    const [post] = await Post.create(
      [
        {
          title: data.title,
          description: data.description,
          status: data.status,
          address: data.address,
          phone: data.phone,
          userIds: [userId],
          petId: petId ?? undefined,
          foundPetInfo: !petId ? data.foundPetInfo : undefined,
          photos: postPhotos,
          locationId: location._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return post;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getMyPosts = async (userId: string) => {
  return Post.find({ userIds: userId })
    .sort({ createdAt: -1 })
    .populate('petId')
    .populate('locationId')
    .populate('userIds', 'fullName email');
};

export const deletePost = async (userId: string, postId: string) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) throw new AppError('Invalid post id', 400);

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  if (!post.userIds.map(id => id.toString()).includes(userId)) {
    throw new AppError('Forbidden', 403);
  }

  await post.deleteOne();
};

export const resolvePost = async (userId: string, postId: string) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) throw new AppError('Invalid post id', 400);

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  if (!post.userIds.map(id => id.toString()).includes(userId)) {
    throw new AppError('Forbidden', 403);
  }

  post.isResolved = true;
  post.resolvedAt = new Date();
  return post.save();
};

export const updatePost = async (userId: string, postId: string, data: UpdatePostData) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError('Invalid post id', 400);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  if (!post.userIds.map(id => id.toString()).includes(userId)) {
    throw new AppError('Forbidden', 403);
  }

  if (data.location) {
    await Location.findByIdAndUpdate(post.locationId, {
      type: data.location.type,
      coordinates: data.location.coordinates,
      description: data.location.description,
    });
  }
  const { location, ...postData } = data;
  Object.assign(post, postData);

  if (post.status === PostStatus.Lost && post.petId && data.foundPetInfo === undefined) {
    await Pet.findByIdAndUpdate(post.petId, {
      ...(data.photos !== undefined && { photos: data.photos }),
    });
  }

  return post.save();
};
