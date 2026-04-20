import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPosts,
  getPostById,
  createPost,
  getMyPosts,
  deletePost,
  resolvePost,
  updatePost,
} from '@/api/posts.api';
import type { CreatePostData, GetPostsParams, UpdatePostData } from '@/types/post.types';
import { QueryKey } from '@/consts/query-key.consts';

export const usePostsQuery = (params: GetPostsParams) => {
  return useQuery({
    queryKey: [QueryKey.POSTS, params],
    queryFn: () => getPosts(params),
  });
};

export const usePostQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKey.POSTS, id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  });
};

export const useCreatePostMutation = () => {
  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
  });
};

export const useMyPostsQuery = () => {
  return useQuery({
    queryKey: [QueryKey.POSTS, 'my'],
    queryFn: getMyPosts,
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] }),
  });
};

export const useResolvePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resolvePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] }),
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostData }) => updatePost(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] }),
  });
};
