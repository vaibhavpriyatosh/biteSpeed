import express from 'express';
import { activityController } from './controller';

const router = express.Router();

router.get('/', (_req, res) => res.send('ROAM AROUND'));

router.post('/identify', activityController);


export default router;