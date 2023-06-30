import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as validate from '../middlewares/validate';
import { userSchema } from '../validators/user';

const router = Router();

router.route('/').post(validate.schema(userSchema), userControllers.save);
router.route('/:id').get(userControllers.fetch);
router.route('/:id').patch(validate.schema(userSchema), userControllers.update);

export default router;
