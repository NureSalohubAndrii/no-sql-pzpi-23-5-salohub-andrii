import { apiRequest } from './client';
import type { CreateOrUpdatePetData, GetMyPetsParams } from '@/types/pet.types';
import type { Pet, PaginatedPets } from '@/types/pet.types';

export const getMyPets = (params: GetMyPetsParams) => {
  return apiRequest<PaginatedPets>('/pets?' + new URLSearchParams(params as any).toString());
};

export const createPet = (data: CreateOrUpdatePetData) => {
  return apiRequest<Pet>('/pets', { method: 'POST', body: JSON.stringify(data) });
};

export const addPetByCode = (code: string) => {
  return apiRequest<Pet>('/pets/add-by-code', { method: 'POST', body: JSON.stringify({ code }) });
};

export const deletePet = (id: string) => {
  return apiRequest<{ success: boolean }>(`/pets/${id}`, { method: 'DELETE' });
};

export const updatePet = (id: string, data: CreateOrUpdatePetData) => {
  return apiRequest<{ success: boolean }>(`/pets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
