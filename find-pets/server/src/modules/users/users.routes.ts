import { Router } from 'express';
import * as userController from './users.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, userController.getMe);

export default router;
