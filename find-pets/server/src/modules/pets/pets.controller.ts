import { SortOrder } from '../../shared/types/common.types';
import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/error.utils';
import { PostSortBy } from '../posts/types/post.types';
import * as petService from './pets.service';
import { PetSize, PetType } from './types/pet.types';

export const getMyPets: ExpressHandler = async (req, res) => {
  try {
    const { page = '1', limit = '6', search, petType, petSize, sortBy, sortOrder } = req.query;

    const result = await petService.getMyPets(req.user?.userId ?? '', {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search === 'undefined' || !search ? undefined : (search as string),
      petType: petType === 'undefined' || !petType ? undefined : (petType as PetType),
      petSize: petSize === 'undefined' || !petSize ? undefined : (petSize as PetSize),
      sortBy: sortBy as PostSortBy,
      sortOrder: sortOrder as SortOrder,
    });

    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const addPetByCode: ExpressHandler = async (req, res) => {
  try {
    const { code } = req.body;
    const pet = await petService.addPetByCode(req.user?.userId ?? '', code);
    res.status(200).json(pet);
  } catch (error) {
    handleError(res, error);
  }
};

export const createPet: ExpressHandler = async (req, res) => {
  try {
    const pet = await petService.createPet(req.user?.userId ?? '', req.body);
    res.status(201).json(pet);
  } catch (error) {
    handleError(res, error);
  }
};

export const deletePet: ExpressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await petService.deletePet(req.user?.userId ?? '', id);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const updatePet: ExpressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId ?? '';

    const updatedPet = await petService.updatePet(userId, id, req.body);

    res.status(200).json(updatedPet);
  } catch (error) {
    handleError(res, error);
  }
};
