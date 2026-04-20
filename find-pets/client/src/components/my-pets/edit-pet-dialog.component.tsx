import { useEffect, useState, type FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Pencil, X } from 'lucide-react';
import {
  PetSize,
  petSizeLabels,
  PetType,
  petTypeLabels,
  type Pet,
  type CreateOrUpdatePetData,
} from '@/types/pet.types';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import PhotoUploader from '../create-post/photos-uploader.component';
import { useUpdatePetMutation } from '@/queries/pets.queries';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';

interface PetEditDialogProps {
  pet: Pet;
}

const PetEditDialog: FC<PetEditDialogProps> = ({ pet }) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [colorInput, setColorInput] = useState('');
  const [photos, setPhotos] = useState<string[]>(pet.photos || []);

  const { mutate: updatePet, isPending } = useUpdatePetMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<CreateOrUpdatePetData>({
    defaultValues: {
      type: pet.type,
      size: pet.size,
      breed: pet.breed || '',
      description: pet.description || '',
      colors: pet.colors || [],
    },
  });

  useEffect(() => {
    if (editOpen) {
      reset({
        type: pet.type,
        size: pet.size,
        breed: pet.breed || '',
        description: pet.description || '',
        colors: pet.colors || [],
      });
      setPhotos(pet.photos || []);
    }
  }, [pet, editOpen, reset]);

  const colors = watch('colors') || [];

  const addColor = () => {
    const trimmed = colorInput.trim().toLowerCase();
    if (trimmed && !colors.includes(trimmed)) {
      setValue('colors', [...colors, trimmed], { shouldValidate: true, shouldDirty: true });
      setColorInput('');
    }
  };

  const removeColor = (colorToRemove: string) => {
    setValue(
      'colors',
      colors.filter(color => color !== colorToRemove),
      { shouldValidate: true }
    );
  };

  const handleEdit = (formData: CreateOrUpdatePetData) => {
    updatePet(
      {
        id: pet._id,
        data: { ...formData, photos, colors },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success('Pet information updated');
          reset();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Update failed');
        },
      }
    );
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <button className='absolute top-2 right-10 p-1.5 rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer hover:bg-accent'>
          <Pencil size={14} />
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit pet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleEdit)} className='flex flex-col gap-4 pt-2'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <Label className='text-[11px] uppercase font-bold tracking-widest text-muted-foreground ml-1'>
                Pet Type
              </Label>
              <Controller
                name='type'
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='bg-background shadow-sm border-muted-foreground/10 cursor-pointer'>
                      <SelectValue />
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
              {errors.type && <p className='text-xs text-destructive'>{errors.type.message}</p>}
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label className='text-[11px] uppercase font-bold tracking-widest text-muted-foreground ml-1'>
                Pet Size
              </Label>
              <Controller
                name='size'
                control={control}
                rules={{ required: 'Size is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='bg-background shadow-sm border-muted-foreground/10 cursor-pointer'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PetSize).map(size => (
                        <SelectItem key={size} value={size}>
                          {petSizeLabels[size]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.size && <p className='text-xs text-destructive'>{errors.size.message}</p>}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>Breed</Label>
            <Input
              placeholder='e.g. British Shorthair'
              {...register('breed', { required: 'Breed is required' })}
            />
            {errors.breed && <p className='text-xs text-destructive'>{errors.breed.message}</p>}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>Colors</Label>
            <div className='flex gap-2'>
              <Input
                placeholder='e.g. gray'
                value={colorInput}
                onChange={e => setColorInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
              <Button type='button' variant='outline' onClick={addColor}>
                Add
              </Button>
            </div>

            <Controller
              name='colors'
              control={control}
              rules={{ validate: value => (value && value.length > 0) || 'Add at least one color' }}
              render={() => (
                <>
                  {colors.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {colors.map(color => (
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
                </>
              )}
            />
            {errors.colors && <p className='text-xs text-destructive'>{errors.colors.message}</p>}
          </div>

          <div className='space-y-1.5'>
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label>Description</Label>
            <Textarea
              placeholder='Any distinctive features...'
              rows={3}
              {...register('description')}
            />
          </div>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setEditOpen(false)}
              disabled={isPending}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending} className='cursor-pointer'>
              {isPending ? 'Saving changes...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PetEditDialog;
