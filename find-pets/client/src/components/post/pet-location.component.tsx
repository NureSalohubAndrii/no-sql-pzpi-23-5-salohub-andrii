import { MapPin, AlertCircle } from 'lucide-react';
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import LocationPicker from '@/components/create-post/location-picker.component';
import { useAddressSearch } from '@/hooks/use-address-search.hook';
import { useEffect } from 'react';

interface LocationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
}

const PetLocation = <T extends FieldValues>({
  register,
  control,
  errors,
  setValue,
  watch,
}: LocationSectionProps<T>) => {
  const {
    search,
    addressResults,
    showDropdown,
    setShowDropdown,
    setIsAddressSelected,
    handleSelectAddress,
    handleInputChange,
    setSearch,
  } = useAddressSearch(setValue);

  const addressPath = 'address' as Path<T>;
  const coordsPath = 'location.coordinates' as Path<T>;
  const locDescPath = 'location.description' as Path<T>;

  const currentAddress = watch(addressPath);
  const coordinates = watch(coordsPath) || [0, 0];

  useEffect(() => {
    if (currentAddress) {
      setSearch(currentAddress);
    }
  }, [currentAddress, setSearch]);

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-primary/10 rounded-lg text-primary'>
            <MapPin size={20} />
          </div>
          <div>
            <CardTitle className='text-lg'>Location</CardTitle>
            <CardDescription>Specify where the pet was lost or found</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label className='text-xs font-bold uppercase'>Address Search *</Label>
            <div className='relative'>
              <Input
                placeholder='City, street...'
                value={search}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => addressResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className={cn(errors[addressPath] && 'border-destructive')}
              />
              {errors[addressPath] && (
                <AlertCircle
                  size={18}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-destructive'
                />
              )}

              {showDropdown && addressResults.length > 0 && (
                <ul className='absolute mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto z-100'>
                  {addressResults.map((result, i) => (
                    <li
                      key={i}
                      onMouseDown={() => handleSelectAddress(result)}
                      className='px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors'
                    >
                      {result.properties.displayName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type='hidden'
              {...register(addressPath, { required: 'Address is required' } as any)}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-xs font-bold uppercase'>Entrance / Details</Label>
            <Input placeholder='e.g. Gate 2' {...register(locDescPath as any)} />
          </div>
        </div>

        <div className='rounded-lg overflow-hidden border h-[350px]'>
          <Controller
            name={coordsPath}
            control={control}
            render={({ field }) => (
              <LocationPicker
                value={field.value}
                onChange={field.onChange}
                onAddressChange={(value: string) => {
                  setValue(addressPath, value as PathValue<T, Path<T>>, { shouldValidate: true });
                  setSearch(value);
                  setIsAddressSelected(true);
                }}
              />
            )}
          />
        </div>

        <div className='flex justify-between text-[10px] font-mono text-muted-foreground bg-muted p-2 rounded'>
          <span>LONGITUDE: {coordinates[0]?.toFixed(6)}</span>
          <span>LATITUDE: {coordinates[1]?.toFixed(6)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetLocation;
