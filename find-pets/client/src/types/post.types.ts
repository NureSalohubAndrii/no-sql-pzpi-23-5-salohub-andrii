import type { SortOrder } from './common.types';
import type { Pet, PetSize, PetType } from './pet.types';
import type { User } from './user.types';

export enum PostStatus {
  Lost = 'lost',
  Found = 'found',
}

export interface Location {
  _id: string;
  type: string;
  coordinates: number[];
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  description?: string;
  status: PostStatus;
  isResolved: boolean;
  address?: string;
  resolvedAt?: Date;
  createdAt: Date;
  userIds: User[];
  petId?: Pet;
  phone: string;
  foundPetInfo?: {
    type?: PetType;
    breed?: string;
    colors?: string[];
    photos?: string[];
    size?: PetSize;
    description?: string;
  };
  locationId: Location;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  petType?: PetType;
  sortBy?: string;
  sortOrder?: SortOrder;
  lon?: number | null;
  lat?: number | null;
  radius?: number;
  petSize?: PetSize;
}

export interface PaginatedPosts {
  data: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export enum PostSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
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
    colors: string[];
    size?: PetSize;
    description?: string;
    photos: string[];
  };
  foundPetInfo?: {
    type?: PetType;
    breed?: string;
    colors: string[];
    size?: PetSize;
    description?: string;
    photos: string[];
  };
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  phone?: string;
  address?: string;
  photos?: string[];
  foundPetInfo?: {
    type?: PetType;
    breed?: string;
    colors?: string[];
    photos?: string[];
    size?: PetSize;
    description?: string;
  };
  location: Location;
}
