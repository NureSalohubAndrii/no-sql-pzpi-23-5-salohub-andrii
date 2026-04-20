import { SortOrder } from '../../../shared/types/common.types';
import { PetSize, PetType } from '../../pets/types/pet.types';

export enum PostStatus {
  Lost = 'lost',
  Found = 'found',
}

export enum PostSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  petType?: PetType;
  sortBy?: PostSortBy;
  sortOrder?: SortOrder;
  lon?: number;
  lat?: number;
  radius?: number;
  petSize?: PetSize;
}

export interface CreatePostData {
  title: string;
  description?: string;
  status: PostStatus;
  address?: string;
  phone: string;
  location: {
    locationType: string;
    coordinates: [number, number];
    description?: string;
  };
  petId?: string;
  newPet?: {
    type: PetType;
    breed?: string;
    colors?: string[];
    photos?: string[];
    size?: PetSize;
    description?: string;
  };
  foundPetInfo?: {
    type?: PetType;
    breed?: string;
    colors?: string[];
    photos?: string[];
    size?: PetSize;
    description?: string;
  };
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  phone?: string;
  address?: string;
  photos?: string[];
  foundPetInfo?: {
    type?: string;
    breed?: string;
    colors?: string[];
    photos?: string[];
    size?: string;
    description?: string;
  };
  location: {
    type: string;
    coordinates: number[];
    description?: string;
  };
}
