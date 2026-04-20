import PostPage from '@/pages/post.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posts/$id')({
  component: PostPage,
});
