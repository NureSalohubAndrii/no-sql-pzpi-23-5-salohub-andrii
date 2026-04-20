import { useEffect, useState, type FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Pencil, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';

import {
  PetSize,
  petSizeLabels,
  PetType,
  petTypeLabels,
  type CreateOrUpdatePetData,
} from '@/types/pet.types';
import { useUpdatePostMutation } from '@/queries/post.queries';
import { useUpdatePetMutation } from '@/queries/pets.queries';
import PhotoUploader from '../create-post/photos-uploader.component';
import PetLocation from '@/components/post/pet-location.component';
import { PostStatus, type Post, type UpdatePostData } from '@/types/post.types';

interface EditPostDialogProps {
  post: Post;
  isResolved: boolean;
}

const EditPostDialog: FC<EditPostDialogProps> = ({ post, isResolved }) => {
  const [editOpen, setEditOpen] = useState(false);
  const isFound = post.status === PostStatus.Found;

  const [photos, setPhotos] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');

  const { mutateAsync: updatePost, isPending: isPostUpdating } = useUpdatePostMutation();
  const { mutateAsync: updatePet, isPending: isPetUpdating } = useUpdatePetMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdatePostData & { petData?: CreateOrUpdatePetData }>();

  const petFieldPath = isFound ? 'foundPetInfo' : 'petData';
  const colors = watch(`${petFieldPath}.colors` as any) || [];

  useEffect(() => {
    if (!editOpen) return;

    const petSource = isFound ? post.foundPetInfo : post.petId;

    reset({
      title: post.title,
      description: post.description ?? '',
      phone: post.phone,
      address: post.address ?? '',
      location: {
        _id: post.locationId._id,
        type: 'Point',
        coordinates: post.locationId.coordinates as [number, number],
        description: post.locationId.description ?? '',
      },
      [petFieldPath]: {
        type: petSource?.type as PetType,
        breed: petSource?.breed ?? '',
        size: petSource?.size as PetSize,
        description: petSource?.description ?? '',
        colors: petSource?.colors ?? [],
      },
    });

    setPhotos(petSource?.photos ?? []);
  }, [editOpen, post, isFound, reset, petFieldPath]);

  const addColor = () => {
    const trimmed = colorInput.trim().toLowerCase();
    if (trimmed && !colors.includes(trimmed)) {
      setValue(`${petFieldPath}.colors` as any, [...colors, trimmed], { shouldValidate: true });
      setColorInput('');
    }
  };

  const removeColor = (colorToRemove: string) => {
    setValue(
      `${petFieldPath}.colors` as any,
      colors.filter((color: string) => color !== colorToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: UpdatePostData & { petData?: CreateOrUpdatePetData }) => {
    try {
      // const currentPetData = isFound ? data.foundPetInfo : data.petData;

      if (!isFound && post.petId?._id && data.petData) {
        await updatePet({
          id: post.petId._id,
          data: { ...data.petData, photos },
        });
      }

      const payload: UpdatePostData = {
        title: data.title,
        description: data.description,
        phone: data.phone,
        address: data.address,
        location: data.location,
      };

      if (isFound && data.foundPetInfo) {
        payload.foundPetInfo = { ...data.foundPetInfo, photos };
      }

      await updatePost({ id: post._id, data: payload });

      setEditOpen(false);
      toast.success('Updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  const isPending = isPostUpdating || isPetUpdating;

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' disabled={isResolved}>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Post & Pet Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 pt-2'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <Label className={cn(errors.title && 'text-destructive')}>
                  Title <span className='text-destructive'>*</span>
                </Label>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  className={cn(errors.title && 'border-destructive')}
                />
                {errors.title && (
                  <p className='text-[11px] text-destructive font-medium'>{errors.title.message}</p>
                )}
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label className={cn(errors.phone && 'text-destructive')}>
                  Phone <span className='text-destructive'>*</span>
                </Label>
                <Input
                  {...register('phone', { required: 'Phone is required' })}
                  className={cn(errors.phone && 'border-destructive')}
                />
                {errors.phone && (
                  <p className='text-[11px] text-destructive font-medium'>{errors.phone.message}</p>
                )}
              </div>
            </div>

            <PetLocation
              register={register as any}
              control={control as any}
              errors={errors}
              setValue={setValue as any}
              watch={watch as any}
            />

            <div className='flex flex-col gap-1.5'>
              <Label>Post Description</Label>
              <Textarea {...register('description')} rows={2} />
            </div>
          </div>

          <div className='border-t pt-5 space-y-4'>
            <p className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              {isFound ? 'Found Pet Characteristics' : 'Pet Profile Details'}
            </p>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <Label>Type *</Label>
                <Controller
                  name={`${petFieldPath}.type` as any}
                  control={control}
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PetType).map(type => (
                          <SelectItem key={type} value={type}>
                            {petTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label>Size *</Label>
                <Controller
                  name={`${petFieldPath}.size` as any}
                  control={control}
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select size' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PetSize).map(s => (
                          <SelectItem key={s} value={s}>
                            {petSizeLabels[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label>Breed {!isFound && '*'}</Label>
              <Input
                {...register(`${petFieldPath}.breed` as any, {
                  required: !isFound ? 'Breed is required' : false,
                })}
                placeholder='e.g. Beagle'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label>Colors {!isFound && '*'}</Label>
              <div className='flex gap-2'>
                <Input
                  value={colorInput}
                  onChange={e => setColorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  placeholder='Add color...'
                />
                <Button type='button' variant='secondary' onClick={addColor}>
                  Add
                </Button>
              </div>

              {colors.length > 0 && (
                <div className='flex flex-wrap gap-1 mt-1'>
                  {colors.map((color: string) => (
                    <Badge key={color} variant='secondary' className='gap-1'>
                      {color}
                      <button
                        type='button'
                        onClick={() => removeColor(color)}
                        className='hover:text-destructive'
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label>Pet Features / Description</Label>
              <Textarea {...register(`${petFieldPath}.description` as any)} rows={2} />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </div>

          <DialogFooter className='gap-2 border-t pt-4'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setEditOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending} className='min-w-[120px]'>
              {isPending ? 'Saving...' : 'Save All Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
