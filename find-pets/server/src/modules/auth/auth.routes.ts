import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshTokens);

export default router;
