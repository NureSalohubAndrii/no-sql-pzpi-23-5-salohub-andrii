import MyPetsPage from '@/pages/my-pets.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-pets')({
  component: MyPetsPage,
});
