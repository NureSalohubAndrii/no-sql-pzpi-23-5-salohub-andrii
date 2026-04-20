import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Controller, useForm } from 'react-hook-form';
import { useVerifyEmailMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';

interface FormValues {
  code: string;
}

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { pendingVerificationEmail: email } = useAuthStore();
  const { mutate: verifyEmail, isPending } = useVerifyEmailMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { code: '' },
  });

  const onSubmit = ({ code }: FormValues) => {
    verifyEmail(
      { email: email ?? '', code },
      {
        onSuccess: () => {
          toast.success('Email verified successfully! You can now log in.');
          navigate({ to: '/login' });
        },
        onError: () => {
          toast.error('Invalid or expired code.', {
            description: 'Please check the code and try again.',
          });
        },
      }
    );
  };

  return (
    <div className='min-h-[calc(100vh-57px)] flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Verify your email</CardTitle>
          <CardDescription>
            We sent a 4-digit code to <span className='font-medium text-foreground'>{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-6'>
            <Controller
              name='code'
              control={control}
              rules={{
                required: 'Code is required',
                minLength: { value: 4, message: 'Enter all 4 digits' },
              }}
              render={({ field }) => (
                <InputOTP maxLength={4} value={field.value} onChange={field.onChange}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className='w-14 h-14 text-xl' />
                    <InputOTPSlot index={1} className='w-14 h-14 text-xl' />
                    <InputOTPSlot index={2} className='w-14 h-14 text-xl' />
                    <InputOTPSlot index={3} className='w-14 h-14 text-xl' />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            {errors.code && <p className='text-sm text-destructive -mt-4'>{errors.code.message}</p>}

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Verifying...' : 'Verify email'}
            </Button>

            <p className='text-sm text-muted-foreground'>
              Didn't receive a code?{' '}
              <button
                type='button'
                className='text-primary underline-offset-4 hover:underline'
                onClick={() => toast.info('Resend functionality coming soon')}
              >
                Resend
              </button>
            </p>

            <Link
              to='/login'
              className='text-sm text-muted-foreground underline-offset-4 hover:underline'
            >
              Back to login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
