import { Router } from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactsController.js';
import { validateBody } from '../utils/validateBody.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', getContacts);
router.get('/contacts/:id', isValidId, getContactById);
router.post('/contacts', validateBody(createContactSchema), createContact);
router.patch('/contacts/:id', isValidId, validateBody(updateContactSchema), updateContact);
router.delete('/contacts/:id', isValidId, deleteContact);

export default router;
