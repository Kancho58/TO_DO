import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as itemControllers from '../controllers/items';
import * as validate from '../middlewares/validate';
import { loginSchema, userSchema } from '../validators/user';
import { itemSchema } from '../validators/item';

const router = Router();

router
  .route('/')
  .get(userControllers.fetchUsers)
  .post(validate.schema(userSchema), userControllers.save);
router
  .route('/login')
  .post(validate.schema(loginSchema), userControllers.login);
router
  .route('/:id/update')
  .patch(validate.schema(userSchema), userControllers.update);
router
  .route('/:id/items')
  .get(itemControllers.fetchItems)
  .post(validate.schema(itemSchema), itemControllers.save);

export default router;
