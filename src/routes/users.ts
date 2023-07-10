import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as itemControllers from '../controllers/items';
import * as validate from '../middlewares/validate';
import { userSchema } from '../validators/user';
import { itemSchema } from '../validators/item';

const router = Router();

router.route('/:page/fetch').get(userControllers.fetchUsers);
router.route('/').post(validate.schema(userSchema), userControllers.save);
router
  .route('/:id/update')
  .patch(validate.schema(userSchema), userControllers.update);
router.route('/:id/:page/items').get(itemControllers.fetchItems);
router
  .route('/:id/items')
  .post(validate.schema(itemSchema), itemControllers.save);

export default router;
