import { create } from 'zustand';
import { PostStatus } from '@/types/post.types';
import { PetType, PetSize } from '@/types/pet.types';
import { SortOrder } from '@/types/common.types';

interface PostFiltersState {
  page: number;
  status: PostStatus | undefined;
  petType: PetType | 'all';
  petSize: PetSize | 'all';
  sortOrder: SortOrder;
  appliedSearch: string;
  radius: number | undefined;

  setPage: (page: number) => void;
  setStatus: (status: PostStatus | undefined) => void;
  setPetType: (type: PetType | 'all') => void;
  setPetSize: (size: PetSize | 'all') => void;
  setSortOrder: (order: SortOrder) => void;
  setAppliedSearch: (search: string) => void;
  setRadius: (radius: number | undefined) => void;
  resetFilters: () => void;
}

export const usePostFiltersStore = create<PostFiltersState>(set => ({
  page: 1,
  status: undefined,
  petType: 'all',
  petSize: 'all',
  sortOrder: SortOrder.DESC,
  appliedSearch: '',
  radius: undefined,

  setPage: page => set({ page }),
  setStatus: status => set({ status, page: 1 }),
  setPetType: petType => set({ petType, page: 1 }),
  setPetSize: petSize => set({ petSize, page: 1 }),
  setSortOrder: sortOrder => set({ sortOrder, page: 1 }),

  setAppliedSearch: appliedSearch => set({ appliedSearch, page: 1 }),

  setRadius: radius => set({ radius, page: 1 }),

  resetFilters: () =>
    set({
      page: 1,
      status: undefined,
      petType: 'all',
      petSize: 'all',
      sortOrder: SortOrder.DESC,
      appliedSearch: '',
      radius: undefined,
    }),
}));
