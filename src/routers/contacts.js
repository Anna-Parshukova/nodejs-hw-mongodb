import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';

import * as contactController from '../controllers/contacts.js';
import {
  contactsAddSchema,
  contactsPatchSchema,
} from '../validation/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactController.getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactController.getContactsByIdController),
);

contactsRouter.post(
  '/',
  validateBody(contactsAddSchema),
  ctrlWrapper(contactController.postContactsController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(contactsPatchSchema),
  ctrlWrapper(contactController.patchContactsController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactController.deleteContactsByIdController),
);

export default contactsRouter;
