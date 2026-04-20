import MyPostsPage from '@/pages/my-posts.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-posts')({
  component: MyPostsPage,
});
