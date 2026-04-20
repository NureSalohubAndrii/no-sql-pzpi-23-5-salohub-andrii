import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyPets, createPet, addPetByCode, deletePet, updatePet } from '@/api/pets.api';
import type { CreateOrUpdatePetData, GetMyPetsParams } from '@/types/pet.types';
import { QueryKey } from '@/consts/query-key.consts';

export const useMyPetsQuery = (params: GetMyPetsParams) =>
  useQuery({
    queryKey: [QueryKey.MY_PETS, params],
    queryFn: () => getMyPets(params),
  });

export const useCreatePetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrUpdatePetData) => createPet(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.MY_PETS] }),
  });
};

export const useAddPetByCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => addPetByCode(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.MY_PETS] }),
  });
};

export const useDeletePetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePet(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.MY_PETS] }),
  });
};

export const useUpdatePetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateOrUpdatePetData }) => updatePet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.MY_PETS],
      });
    },
  });
};
