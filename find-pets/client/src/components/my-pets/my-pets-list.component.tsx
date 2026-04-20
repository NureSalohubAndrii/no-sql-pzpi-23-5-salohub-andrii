import { PetType, petTypeLabels, type PaginatedPets } from '@/types/pet.types';
import type { FC } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useMyPetsFiltersStore } from '@/store/my-pets.filters.store';
import PetDeleteDialog from './delete-pet-dialog.component';
import PetEditDialog from './edit-pet-dialog.component';

interface MyPetsListProps {
  isLoading: boolean;
  data?: PaginatedPets;
}

const LIMIT = 6;

const MyPetsList: FC<MyPetsListProps> = ({ isLoading, data }) => {
  const { page, setPage, resetFilters } = useMyPetsFiltersStore();

  return (
    <>
      {isLoading ? (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className='rounded-xl border bg-muted animate-pulse h-52' />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className='text-center py-24 border-2 border-dashed rounded-xl bg-muted/5'>
          <p className='text-muted-foreground'>No pets found matching your criteria.</p>
          <Button variant='link' onClick={resetFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {data?.data.map(pet => (
            <div
              key={pet._id}
              className='rounded-xl border overflow-hidden bg-card group transition-all hover:shadow-md'
            >
              <div className='aspect-video bg-muted relative'>
                {pet.photos?.[0] ? (
                  <img src={pet.photos[0]} alt={pet.type} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-4xl text-muted-foreground opacity-30'>
                    🐾
                  </div>
                )}
                <PetEditDialog pet={pet} />
                <PetDeleteDialog pet={pet} />
              </div>
              <div className='p-3 flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-sm capitalize truncate'>{pet.breed}</span>
                  </div>
                  {pet.size && (
                    <Badge variant='outline' className='text-[10px] h-5 capitalize'>
                      {pet.size}
                    </Badge>
                  )}
                </div>

                <div className='flex flex-wrap gap-1'>
                  {pet.type && (
                    <Badge variant='secondary' className='text-[10px] h-4 px-1.5'>
                      {petTypeLabels[pet.type as PetType] ?? pet.type}
                    </Badge>
                  )}
                  {pet.colors.length > 0 &&
                    pet.colors.map(color => (
                      <Badge key={color} variant='secondary' className='text-[10px] h-4 px-1.5'>
                        {color}
                      </Badge>
                    ))}
                </div>

                {pet.description && (
                  <p className='text-[11px] text-muted-foreground leading-relaxed'>
                    {pet.description}
                  </p>
                )}

                <p className='text-[11px] text-muted-foreground font-mono tracking-widest bg-muted/50 w-fit px-1.5 rounded'>
                  #{pet.code}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 pt-4'>
          <Button
            variant='outline'
            size='sm'
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <div className='flex gap-1'>
            {Array.from({ length: data.totalPages }).map((_, i) => (
              <Button
                key={i}
                size='sm'
                variant={page === i + 1 ? 'default' : 'outline'}
                className='w-8 h-8'
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant='outline'
            size='sm'
            disabled={page === data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default MyPetsList;
