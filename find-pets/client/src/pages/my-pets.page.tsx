import { useMemo } from 'react';
import { useMyPetsQuery } from '@/queries/pets.queries';
import MyPetsFiltersBar from '@/components/my-pets/my-pets-filters-bar.component';
import { useMyPetsFiltersStore } from '@/store/my-pets.filters.store';
import AddPetDialog from '@/components/my-pets/add-pet-dialog.component';
import AddPetByCode from '@/components/my-pets/add-pet-by-code.component';
import MyPetsList from '@/components/my-pets/my-pets-list.component';

const LIMIT = 6;

const MyPetsPage = () => {
  const { page, petType, petSize, appliedSearch } = useMyPetsFiltersStore();

  const queryParams = useMemo(
    () => ({
      page,
      limit: LIMIT,
      petType: petType === 'all' ? undefined : petType,
      petSize: petSize === 'all' ? undefined : petSize,
      search: appliedSearch.trim() || undefined,
    }),
    [page, petType, petSize, appliedSearch]
  );

  const { data, isLoading } = useMyPetsQuery(queryParams);

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>My pets</h1>
        <div className='flex gap-2'>
          <AddPetByCode />

          <AddPetDialog />
        </div>
      </div>

      <MyPetsFiltersBar />

      <MyPetsList isLoading={isLoading} data={data} />
    </div>
  );
};

export default MyPetsPage;
