import { useMyPetsFiltersStore } from '@/store/my-pets.filters.store';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PetSize, petSizeLabels, PetType, petTypeLabels } from '@/types/pet.types';

const MyPetsFiltersBar = () => {
  const { petType, setPetType, petSize, setPetSize, appliedSearch, setAppliedSearch } =
    useMyPetsFiltersStore();

  const [localSearch, setLocalSearch] = useState(appliedSearch);

  useEffect(() => {
    setLocalSearch(appliedSearch);
  }, [appliedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(localSearch);
  };

  return (
    <div className='flex flex-wrap gap-3'>
      <form onSubmit={handleSearchSubmit} className='flex gap-2 flex-1 min-w-[200px]'>
        <div className='relative flex-1'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />
          <Input
            placeholder='Search by breed, code...'
            className='pl-9'
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
          />
        </div>
        <Button type='submit' variant='outline' className='cursor-pointer'>
          Search
        </Button>
      </form>

      <Select value={petType} onValueChange={value => setPetType(value as PetType | 'all')}>
        <SelectTrigger className='w-[140px] bg-background shadow-sm border-muted-foreground/10 cursor-pointer'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All types</SelectItem>
          {Object.values(PetType).map(type => (
            <SelectItem key={type} value={type}>
              {petTypeLabels[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={petSize} onValueChange={value => setPetSize(value as PetSize | 'all')}>
        <SelectTrigger className='w-[140px] bg-background shadow-sm border-muted-foreground/10 cursor-pointer'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All sizes</SelectItem>
          {Object.values(PetSize).map(size => (
            <SelectItem key={size} value={size}>
              {petSizeLabels[size]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MyPetsFiltersBar;
