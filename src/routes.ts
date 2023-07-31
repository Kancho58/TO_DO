import { Router } from 'express';
import userRoutes from './routes/users';
import itemRoutes from './routes/items';
import adminRoutes from './routes/admin';
import authenticate from './middlewares/authenticate';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use(authenticate);
router.use('/items', itemRoutes);

export default router;
