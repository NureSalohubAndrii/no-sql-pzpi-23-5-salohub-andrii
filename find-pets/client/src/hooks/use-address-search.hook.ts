import { useState, useEffect } from 'react';
import { searchLocations, type NominatimFeature } from '@/api/nominatim.api';
import { type UseFormSetValue, type FieldValues, type Path, type PathValue } from 'react-hook-form';

export const useAddressSearch = <T extends FieldValues>(setValue: UseFormSetValue<T>) => {
  const [search, setSearch] = useState<string>('');
  const [addressResults, setAddressResults] = useState<NominatimFeature[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!search || isAddressSelected) return;
      try {
        const response = await searchLocations(search);
        setAddressResults(response);
        setShowDropdown(true);
      } catch (error) {
        console.error('Location search failed:', error);
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [search, isAddressSelected]);

  const handleSelectAddress = (result: NominatimFeature) => {
    const addr = result.properties.displayName;
    setSearch(addr);

    setValue('address' as Path<T>, addr as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });

    setValue(
      'location.coordinates' as Path<T>,
      [result.properties.lon, result.properties.lat] as PathValue<T, Path<T>>,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    setIsAddressSelected(true);
    setShowDropdown(false);
  };

  const handleInputChange = (value: string) => {
    setSearch(value);
    setIsAddressSelected(false);
    if (!value) {
      setValue('address' as Path<T>, '' as PathValue<T, Path<T>>);
    }
  };

  return {
    search,
    setSearch,
    addressResults,
    showDropdown,
    setShowDropdown,
    setIsAddressSelected,
    handleSelectAddress,
    handleInputChange,
  };
};
