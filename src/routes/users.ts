import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as authControllers from '../controllers/auth';
import * as validate from '../middlewares/validate';
import { loginSchema, updateSchema, userSchema } from '../validators/user';
import authenticate from '../middlewares/authenticate';

const router = Router();

router
  .route('/register')
  .post(validate.schema(userSchema), authControllers.register);
router
  .route('/login')
  .post(validate.schema(loginSchema), authControllers.login);

router.use(authenticate);

router.route('/my').get(authenticate, userControllers.fetchUserDetails);

router
  .route('/update')
  .patch(validate.schema(updateSchema), userControllers.update);

export default router;
