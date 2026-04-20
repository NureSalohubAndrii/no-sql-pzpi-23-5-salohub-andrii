import { Router } from 'express';
import * as postsController from './posts.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', postsController.getPosts);
router.post('/', authMiddleware, postsController.createPost);
router.get('/my', authMiddleware, postsController.getMyPosts);
router.get('/:id', postsController.getPostById);
router.delete('/:id', authMiddleware, postsController.deletePost);
router.patch('/:id', authMiddleware, postsController.updatePost);
router.patch('/:id/resolve', authMiddleware, postsController.resolvePost);

export default router;
