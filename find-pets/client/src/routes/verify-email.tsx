import VerifyEmailPage from '@/pages/verify-email.page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
});
