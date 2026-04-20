import { useForm } from 'react-hook-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LoginRequest } from '@/types/auth.types';
import { useLoginMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: loginUser, isPending } = useLoginMutation();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = (data: LoginRequest) => {
    loginUser(data, {
      onSuccess: response => {
        setAuth(response.accessToken);
        toast.success('Welcome back!');
        navigate({ to: '/' });
      },

      onError: () => {
        toast.error('Invalid credentials.', {
          description: 'Please check your email and password.',
        });
      },
    });
  };

  return (
    <div className='min-h-[calc(100vh-57px)] flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Welcome back</CardTitle>
          <CardDescription>
            Don't have an account?{' '}
            <Link to='/register' className='text-primary underline-offset-4 hover:underline'>
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john@example.com'
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
            </div>

            <div className='flex flex-col gap-1.5'>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className='text-sm text-destructive'>{errors.password.message}</p>
              )}
            </div>

            <Button type='submit' className='w-full mt-2' disabled={isPending}>
              {isPending ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
