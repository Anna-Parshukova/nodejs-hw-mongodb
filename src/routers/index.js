import { Router } from 'express';
import ContactsRouter from './contacts.js';
import UsersRouter from './auth.js';

const router = Router();

router.use('/auth', UsersRouter);
router.use('/contacts', ContactsRouter);

export default router;
