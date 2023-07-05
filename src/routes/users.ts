import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as validate from '../middlewares/validate';
import { userSchema } from '../validators/user';

const router = Router();

router
  .route('/')
  .get(userControllers.fetchUsers)
  .post(validate.schema(userSchema), userControllers.save);
router.route('/:id').patch(validate.schema(userSchema), userControllers.update);

export default router;
