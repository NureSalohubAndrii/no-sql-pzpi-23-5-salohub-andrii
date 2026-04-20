import { PlusCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Controller, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  PetSize,
  petSizeLabels,
  PetType,
  petTypeLabels,
  type CreateOrUpdatePetData,
} from '@/types/pet.types';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useEffect, useState } from 'react';
import { useCreatePetMutation } from '@/queries/pets.queries';

const AddPetDialog = () => {
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [colorInput, setColorInput] = useState('');

  const { mutate: createPet, isPending: isCreating } = useCreatePetMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrUpdatePetData>({
    defaultValues: {
      colors: [],
    },
  });

  useEffect(() => {
    if (!createOpen) {
      reset();
      setColorInput('');
    }
  }, [createOpen, reset]);

  const colors = watch('colors') || [];

  const handleCreate = (formData: CreateOrUpdatePetData) => {
    createPet(formData, {
      onSuccess: () => {
        reset();
        setCreateOpen(false);
      },
      onError: error => console.error(error?.message || 'Failed to create pet'),
    });
  };

  const addColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !colors.includes(trimmed)) {
      setValue('colors', [...colors, trimmed], { shouldValidate: true });
    }
    setColorInput('');
  };

  const removeColor = (colorToRemove: string) => {
    setValue(
      'colors',
      colors.filter(color => color !== colorToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <PlusCircle size={16} className='mr-2' />
          Add pet
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Add new pet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreate)} className='flex flex-col gap-4 pt-2'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <Label>Type</Label>
              <Controller
                name='type'
                control={control}
                rules={{ required: 'Type is required' }}
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
              {errors.type && <p className='text-xs text-destructive'>{errors.type.message}</p>}
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label>Size</Label>
              <Controller
                name='size'
                control={control}
                rules={{ required: 'Size is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select size' />
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

          <div className='flex flex-col gap-1.5'>
            <Label>Description</Label>
            <Textarea
              placeholder='Any distinctive features...'
              rows={2}
              {...register('description')}
            />
          </div>

          <Button type='submit' disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create pet'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;
