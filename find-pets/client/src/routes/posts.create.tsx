import CreatePostPage from '@/pages/create-post.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/create')({
  component: CreatePostPage,
});
