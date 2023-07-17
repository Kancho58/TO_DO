import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as itemControllers from '../controllers/items';
import * as validate from '../middlewares/validate';
import { loginSchema, userSchema } from '../validators/user';
import { itemSchema } from '../validators/item';
import authenticate, { authorizeByAdmin } from '../middlewares/authenticate';

const router = Router();

router
  .route('/')
  .get(authorizeByAdmin, userControllers.fetchUsers)
  .post(validate.schema(userSchema), userControllers.save);

router.route('/:id/user').get(authorizeByAdmin, userControllers.fetchUsersById);
router
  .route('/login')
  .post(validate.schema(loginSchema), userControllers.login);
router
  .route('/:id/update')
  .patch(validate.schema(userSchema), userControllers.update);
router
  .route('/:id/items')
  .get(authenticate, itemControllers.fetchItems)
  .post(validate.schema(itemSchema), authenticate, itemControllers.save);

export default router;
