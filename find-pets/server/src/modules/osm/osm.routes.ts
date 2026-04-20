import { Router } from 'express';
import * as osmController from './osm.controller';

const router = Router();

router.get('/search', osmController.searchAddress);
router.get('/reverse', osmController.reverseGeocoding);

export default router;
