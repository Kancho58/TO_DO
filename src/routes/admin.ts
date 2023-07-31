import { Router } from 'express';
import * as userControllers from '../controllers/users';
import * as itemControllers from '../controllers/items';

import { authorizeByAdmin } from '../middlewares/authenticate';

const router = Router();

router.use(authorizeByAdmin);

router.route('/user').post(userControllers.save);

router.route('/users/:id/items').get(itemControllers.fetchItemsByAdmin);

router.route('/users/').get(userControllers.fetchUsers);

router.route('/user/:id').get(userControllers.fetchUserById);

export default router;
