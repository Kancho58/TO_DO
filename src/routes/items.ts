import { Router } from 'express';
import * as itemControllers from '../controllers/items';
import * as validate from '../middlewares/validate';
import { itemSchema } from '../validators/item';

const router = Router();
router
  .route('/')
  .get(itemControllers.fetchItems)
  .post(validate.schema(itemSchema), itemControllers.save);

router
  .route('/:id/update')
  .patch(validate.schema(itemSchema), itemControllers.update);

export default router;
