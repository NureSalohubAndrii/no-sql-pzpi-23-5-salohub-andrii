import { PetSize, petSizeLabels, PetType, petTypeLabels } from '@/types/pet.types';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { CreatePostData } from '@/types/post.types';

interface PetFieldsProps {
  prefix: 'newPet' | 'foundPetInfo';
  register: UseFormRegister<CreatePostData>;
  control: Control<CreatePostData>;
  errors: FieldErrors<CreatePostData>;
  colors: string[];
  colorInput: string;
  setColorInput: (value: string) => void;
  addColor: () => void;
  removeColor: (color: string) => void;
  requireFullValidation?: boolean;
}

const PetFields = ({
  prefix,
  register,
  control,
  errors,
  colors,
  colorInput,
  setColorInput,
  addColor,
  removeColor,
  requireFullValidation = false,
}: PetFieldsProps) => {
  const sectionErrors = errors[prefix] as Record<string, any> | undefined;

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label className={cn(sectionErrors?.type && 'text-destructive')}>Animal Type *</Label>
          <Controller
            name={`${prefix}.type`}
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger
                  className={cn('w-full', sectionErrors?.type && 'border-destructive')}
                >
                  <SelectValue placeholder='Select' />
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
          {sectionErrors?.type && (
            <p className='text-[11px] text-destructive font-medium'>{sectionErrors.type.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label className={cn(sectionErrors?.size && 'text-destructive')}>Estimated Size *</Label>
          <Controller
            name={`${prefix}.size` as any}
            control={control}
            rules={{ required: 'Required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger
                  className={cn('w-full', sectionErrors?.size && 'border-destructive')}
                >
                  <SelectValue placeholder='Select' />
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
          {sectionErrors?.size && (
            <p className='text-[11px] text-destructive font-medium'>{sectionErrors.size.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label className={cn(sectionErrors?.breed && 'text-destructive')}>
          Breed {requireFullValidation && '*'}
        </Label>
        <Input
          placeholder='e.g. Labrador'
          className={cn(sectionErrors?.breed && 'border-destructive')}
          {...register(`${prefix}.breed` as any, {
            required: requireFullValidation ? 'Breed is required' : false,
          })}
        />
        {sectionErrors?.breed && (
          <p className='text-[11px] text-destructive font-medium'>{sectionErrors.breed.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label className={cn(sectionErrors?.colors && 'text-destructive')}>
          Main Colors {requireFullValidation && '*'}
        </Label>
        <div className='flex gap-2'>
          <Input
            placeholder='Enter to add'
            value={colorInput}
            className={cn(sectionErrors?.colors && 'border-destructive')}
            onChange={e => setColorInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
          />
          <Button type='button' variant='secondary' onClick={addColor}>
            Add
          </Button>
        </div>
        <Controller
          name={`${prefix}.colors` as any}
          control={control}
          rules={{
            validate: () => !requireFullValidation || colors.length > 0 || 'Add at least one color',
          }}
          render={() =>
            sectionErrors?.colors && (
              <p className='text-[11px] text-destructive font-medium'>
                {sectionErrors.colors.message}
              </p>
            )
          }
        />
        <div className='flex flex-wrap gap-1.5 mt-2'>
          {colors.map(color => (
            <Badge key={color} variant='secondary' className='pl-2 pr-1 py-1 gap-1'>
              {color}
              <button
                type='button'
                onClick={() => removeColor(color)}
                className='hover:text-destructive'
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Features</Label>
        <Textarea
          placeholder='Distinguishing marks, collar details, etc...'
          rows={2}
          className='resize-none'
          {...register(`${prefix}.description` as any)}
        />
      </div>
    </div>
  );
};

export default PetFields;
