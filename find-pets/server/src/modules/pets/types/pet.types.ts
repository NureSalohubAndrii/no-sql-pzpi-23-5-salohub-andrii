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

export interface GetMyPetsParams {
  page?: number;
  limit?: number;
  search?: string;
  petType?: PetType;
  petSize?: PetSize;
  sortBy?: string;
  sortOrder?: string;
}

export interface AddPetByCodeData {
  code: string;
}

export interface CreateOrUpdatePetData {
  type: PetType;
  breed?: string;
  colors?: string[];
  photos?: string[];
  size?: PetSize;
  description?: string;
}
