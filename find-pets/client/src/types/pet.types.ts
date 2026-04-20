import type { SortOrder } from './common.types';

export enum PetType {
  Dog = 'dog',
  Cat = 'cat',
  Rabbit = 'rabbit',
  Bird = 'bird',
  Other = 'other',
}

export enum PetSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export interface Pet {
  _id: string;
  type: PetType;
  breed?: string;
  colors: string[];
  photos: string[];
  size: PetSize;
  description?: string;
  code: string;
  activePostsCount: number;
  ownersCount: number;
}

export interface GetMyPetsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: PetType;
  size?: PetSize;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginatedPets {
  data: Pet[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateOrUpdatePetData {
  type: PetType;
  breed?: string;
  colors?: string[];
  photos?: string[];
  size: PetSize;
  description?: string;
}

export const petTypeLabels: Record<PetType, string> = {
  [PetType.Dog]: 'Dog',
  [PetType.Cat]: 'Cat',
  [PetType.Rabbit]: 'Rabbit',
  [PetType.Bird]: 'Bird',
  [PetType.Other]: 'Other',
};

export const petSizeLabels: Record<PetSize, string> = {
  [PetSize.Small]: 'Small',
  [PetSize.Medium]: 'Medium',
  [PetSize.Large]: 'Large',
};

export enum PetMode {
  EXISTING = 'existing',
  NEW = 'new',
}
