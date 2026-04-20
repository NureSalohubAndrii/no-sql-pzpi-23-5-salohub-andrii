import { useForm } from 'react-hook-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RegisterUserRequest } from '@/types/auth.types';
import { useRegisterUserMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegisterUserMutation();
  const { setPendingVerificationEmail } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserRequest>();

  const onSubmit = (data: RegisterUserRequest) => {
    registerUser(data, {
      onSuccess: response => {
        setPendingVerificationEmail(response.email);
        toast.success('Account created! Please verify your email.');
        navigate({ to: '/verify-email', search: { email: data.email } });
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Registration failed');
      },
    });
  };

  return (
    <div className='min-h-[calc(100vh-57px)] flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>
            Already have an account?{' '}
            <Link to='/login' className='text-primary underline-offset-4 hover:underline'>
              Log in
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='fullName'>Full name</Label>
              <Input
                id='fullName'
                placeholder='John Doe'
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className='text-sm text-destructive'>{errors.fullName.message}</p>
              )}
            </div>

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
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
              />
              {errors.password && (
                <p className='text-sm text-destructive'>{errors.password.message}</p>
              )}
            </div>

            <Button type='submit' className='w-full mt-2' disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
