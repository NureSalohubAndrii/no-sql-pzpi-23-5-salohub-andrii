import { apiRequest } from './client';
import type {
  CreatePostData,
  GetPostsParams,
  PaginatedPosts,
  Post,
  UpdatePostData,
} from '@/types/post.types';

export const getPosts = (params: GetPostsParams) => {
  return apiRequest<PaginatedPosts>('/posts?' + new URLSearchParams(params as any).toString());
};

export const getPostById = (id: string) => {
  return apiRequest<Post>(`/posts/${id}`);
};

export const createPost = (data: CreatePostData) => {
  return apiRequest<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getMyPosts = () => {
  return apiRequest<Post[]>('/posts/my');
};

export const deletePost = (id: string) => {
  return apiRequest<void>(`/posts/${id}`, { method: 'DELETE' });
};

export const resolvePost = (id: string) => {
  return apiRequest<Post>(`/posts/${id}/resolve`, { method: 'PATCH' });
};

export const updatePost = (id: string, data: UpdatePostData) =>
  apiRequest<Post>(`/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
