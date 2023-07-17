import { Router } from 'express';
import userRoutes from './routes/users';
import itemRoutes from './routes/items';
import authenticate, { authorizeByAdmin } from './middlewares/authenticate';
import * as itemControllers from './controllers/items';
const router: Router = Router();

router.use('/users', userRoutes);
router
  .route('/items/byadmin')
  .get(authorizeByAdmin, itemControllers.fetchItemsByAdmin);

router.use(authenticate);
router.use('/items', itemRoutes);

export default router;
