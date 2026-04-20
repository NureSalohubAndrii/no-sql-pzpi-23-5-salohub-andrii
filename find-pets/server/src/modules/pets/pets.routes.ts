import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import * as petsController from './pets.controller';

const router = Router();

router.get('/', authMiddleware, petsController.getMyPets);
router.post('/', authMiddleware, petsController.createPet);
router.post('/add-by-code', authMiddleware, petsController.addPetByCode);
router.delete('/:id', authMiddleware, petsController.deletePet);
router.patch('/:id', authMiddleware, petsController.updatePet);

export default router;
