import { PawPrint } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PetMode, type PaginatedPets } from '@/types/pet.types';
import { Label } from '../ui/label';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import PetFields from '../my-pets/pet-fields.component';
import type { FC } from 'react';
import { PostStatus, type CreatePostData } from '@/types/post.types';
import { cn } from '@/lib/utils';

interface PetDetailsProps {
  petMode: PetMode;
  register: UseFormRegister<CreatePostData>;
  control: Control<CreatePostData>;
  errors: FieldErrors<CreatePostData>;
  setPetMode: (mode: PetMode) => void;
  status: PostStatus;
  myPets?: PaginatedPets;
  colors: string[];
  colorInput: string;
  setColorInput: (val: string) => void;
  addColor: () => void;
  removeColor: (color: string) => void;
}

const PetDetails: FC<PetDetailsProps> = ({
  control,
  register,
  errors,
  petMode,
  setPetMode,
  status,
  myPets,
  colors,
  colorInput,
  setColorInput,
  addColor,
  removeColor,
}) => {
  const isLost = status === PostStatus.Lost;

  return (
    <Card className='shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-primary/10 rounded-lg text-primary'>
            <PawPrint size={20} />
          </div>
          <div>
            <CardTitle className='text-lg'>Pet Details</CardTitle>
            <CardDescription>Information about the animal</CardDescription>
          </div>
        </div>
        {isLost && myPets && myPets.data.length > 0 && (
          <div className='bg-muted p-1 rounded-md flex gap-1'>
            <Button
              type='button'
              variant={petMode === PetMode.EXISTING ? 'default' : 'ghost'}
              size='sm'
              className='h-7 text-xs cursor-pointer'
              onClick={() => setPetMode(PetMode.EXISTING)}
            >
              My Pets
            </Button>
            <Button
              type='button'
              variant={petMode === PetMode.NEW ? 'default' : 'ghost'}
              size='sm'
              className='h-7 text-xs cursor-pointer'
              onClick={() => setPetMode(PetMode.NEW)}
            >
              New Pet
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLost && petMode === PetMode.EXISTING && myPets?.data.length ? (
          <div className='space-y-4'>
            <Label className={cn(errors.petId && 'text-destructive')}>
              Select from your registered pets *
            </Label>
            <Controller
              name='petId'
              control={control}
              rules={{ required: 'Please select a pet' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn('h-12', errors.petId && 'border-destructive')}>
                    <SelectValue placeholder='Click to choose a pet' />
                  </SelectTrigger>
                  <SelectContent>
                    {myPets.data.map(pet => (
                      <SelectItem key={pet._id} value={pet._id}>
                        <div className='flex flex-col items-start'>
                          <span className='font-medium'>{pet.breed || pet.type}</span>
                          <span className='text-xs text-muted-foreground'>#{pet.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.petId && <p className='text-xs text-destructive'>{errors.petId.message}</p>}
          </div>
        ) : (
          <PetFields
            prefix={isLost ? 'newPet' : 'foundPetInfo'}
            register={register}
            control={control}
            errors={errors}
            colors={colors}
            colorInput={colorInput}
            setColorInput={setColorInput}
            addColor={addColor}
            removeColor={removeColor}
            requireFullValidation={isLost}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PetDetails;
