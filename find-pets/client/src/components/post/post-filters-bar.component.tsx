import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PostStatus } from '@/types/post.types';
import { PetType, petTypeLabels, PetSize, petSizeLabels } from '@/types/pet.types';
import { SortOrder } from '@/types/common.types';
import { usePostFiltersStore } from '@/store/post-filters.store';

const PostFiltersBar = () => {
  const {
    status,
    setStatus,
    petType,
    setPetType,
    petSize,
    setPetSize,
    sortOrder,
    setSortOrder,
    appliedSearch,
    setAppliedSearch,
    radius,
    setRadius,
  } = usePostFiltersStore();

  const [localSearch, setLocalSearch] = useState(appliedSearch);

  useEffect(() => {
    setLocalSearch(appliedSearch);
  }, [appliedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(localSearch);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 items-center'>
        <form onSubmit={handleSearchSubmit} className='lg:col-span-8 flex gap-2'>
          <div className='relative flex-1'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
            />
            <Input
              placeholder='Search by title or details...'
              className='pl-10 h-11 bg-background shadow-sm border-muted-foreground/20'
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
          </div>
          <Button type='submit' className='h-11 px-8 cursor-pointer'>
            Search
          </Button>
        </form>

        <div className='lg:col-span-4 flex p-1 bg-muted rounded-xl h-11 border shadow-inner'>
          {[undefined, PostStatus.Lost, PostStatus.Found].map(s => (
            <button
              key={s ?? 'all'}
              onClick={() => setStatus(s)}
              className={`flex-1 flex items-center justify-center text-sm font-medium transition-all rounded-lg cursor-pointer ${
                status === s
                  ? 'bg-background shadow text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === PostStatus.Lost ? 'Lost' : s === PostStatus.Found ? 'Found' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap items-end gap-5 p-5 bg-muted/30 rounded-2xl border border-border/60'>
        <div className='space-y-2'>
          <label className='text-[11px] uppercase font-bold tracking-widest text-muted-foreground ml-1'>
            Pet Type
          </label>
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
        </div>

        <div className='space-y-2'>
          <label className='text-[11px] uppercase font-bold tracking-widest text-muted-foreground ml-1'>
            Pet Size
          </label>
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

        <div className='space-y-2'>
          <label className='text-[11px] uppercase font-bold tracking-widest text-muted-foreground ml-1'>
            Sort Order
          </label>
          <Select value={sortOrder} onValueChange={v => setSortOrder(v as SortOrder)}>
            <SelectTrigger className='w-[150px] bg-background shadow-sm border-muted-foreground/10 cursor-pointer'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOrder.DESC}>Newest first</SelectItem>
              <SelectItem value={SortOrder.ASC}>Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex-1 min-w-[220px] space-y-4 px-2'>
          <div className='flex justify-between items-center'>
            <span className='text-[11px] uppercase font-bold tracking-widest text-muted-foreground'>
              Radius:{' '}
              <span className='text-primary font-black'>{radius ? `${radius} km` : '∞'}</span>
            </span>
            {radius && (
              <button
                onClick={() => setRadius(undefined)}
                className='text-[10px] font-bold text-muted-foreground hover:text-destructive underline decoration-dotted underline-offset-4 cursor-pointer'
              >
                Clear
              </button>
            )}
          </div>
          <Slider
            max={100}
            step={5}
            value={[radius ?? 0]}
            onValueChange={value => setRadius(value[0] || undefined)}
            className='cursor-pointer'
          />
        </div>
      </div>
    </div>
  );
};

export default PostFiltersBar;
