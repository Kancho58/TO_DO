import { Router } from 'express';
import userRoutes from './routes/users';
import itemRoutes from './routes/items';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/items', itemRoutes);

export default router;
