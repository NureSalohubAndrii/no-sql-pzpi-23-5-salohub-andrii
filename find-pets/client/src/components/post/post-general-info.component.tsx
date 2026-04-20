import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { PostStatus, type CreatePostData } from '@/types/post.types';
import type { FC } from 'react';

interface PostGeneralInfoProps {
  register: UseFormRegister<CreatePostData>;
  errors: FieldErrors<CreatePostData>;
  status: PostStatus;
}

const PostGeneralInfo: FC<PostGeneralInfoProps> = ({ register, errors, status }) => {
  const isLost = status === PostStatus.Lost;

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-primary/10 rounded-lg text-primary'>
            <Info size={20} />
          </div>
          <div>
            <CardTitle className='text-lg'>General Information</CardTitle>
            <CardDescription>Provide a clear title for your post</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='title'>
            Post Title <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='title'
            placeholder={isLost ? 'e.g. Lost gray cat "Tom"' : 'e.g. Found small golden retriever'}
            {...register('title', { required: 'Title is required' })}
            className={cn(errors.title && 'border-destructive')}
          />
          {errors.title && (
            <p className='text-xs font-medium text-destructive'>{errors.title.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone'>
            Contact Phone
            <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='phone'
            placeholder='e.g. +380 99 123 4567'
            {...register('phone', { required: 'Contact phone is required' })}
            className={cn(errors.phone && 'border-destructive')}
          />
          {errors.phone && (
            <p className='text-xs font-medium text-destructive'>{errors.phone.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Detailed Description</Label>
          <Textarea
            id='description'
            placeholder='Describe the situation, behavior, or any specific details...'
            className='min-h-[120px] resize-none'
            {...register('description')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostGeneralInfo;
