import { SortOrder } from '../../shared/types/common.types';
import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/error.utils';
import { PetSize, PetType } from '../pets/types/pet.types';
import * as postsService from './posts.service';
import { PostSortBy, PostStatus } from './types/post.types';

export const getPosts: ExpressHandler = async (req, res) => {
  try {
    const {
      page = '1',
      limit = '8',
      search,
      status,
      petType,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      petSize,
      lon,
      lat,
      radius,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const result = await postsService.getPosts({
      page: pageNum,
      limit: limitNum,
      search: search === 'undefined' || !search ? undefined : (search as string),
      status: status === 'undefined' || !status ? undefined : (status as PostStatus),
      petType: petType === 'undefined' || !petType ? undefined : (petType as PetType),
      petSize: petSize === 'undefined' || !petSize ? undefined : (petSize as PetSize),
      sortBy: sortBy as PostSortBy,
      sortOrder: sortOrder as SortOrder,
      lon: lon === 'undefined' || !lon ? undefined : +lon,
      lat: lat === 'undefined' || !lat ? undefined : +lat,
      radius: radius === 'undefined' || !radius ? undefined : +radius,
    });

    res.status(200).json({
      message: 'Posts',
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPostById: ExpressHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postsService.getPostById(id);

    res.status(200).json(post);
  } catch (error) {
    handleError(res, error);
  }
};

export const createPost: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId ?? '';
    const post = await postsService.createPost(userId, req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('createPost error:', error);
    handleError(res, error);
  }
};

export const getMyPosts: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId ?? '';
    const posts = await postsService.getMyPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    handleError(res, error);
  }
};

export const deletePost: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId ?? '';
    await postsService.deletePost(userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

export const resolvePost: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId ?? '';
    const post = await postsService.resolvePost(userId, req.params.id);
    res.status(200).json(post);
  } catch (error) {
    handleError(res, error);
  }
};

export const updatePost: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId ?? '';
    const post = await postsService.updatePost(userId, req.params.id, req.body);
    res.status(200).json(post);
  } catch (error) {
    handleError(res, error);
  }
};
