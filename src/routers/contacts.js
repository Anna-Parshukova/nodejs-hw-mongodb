import { Router } from 'express';
import ContactsCollection from '../db/contactModel.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// Отримання всіх контактів
router.get('/contacts', ctrlWrapper(async (_, res) => {
    const data = await ContactsCollection.find();
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data,
    });
}));

// Отримання конкретного контакту за ID
router.get('/contacts/:_id', ctrlWrapper(async (req, res) => {
    const { _id } = req.params;
    const data = await ContactsCollection.findById(_id);

    if (!data) {
        return res.status(404).json({
            status: 404,
            message: `Contact with id=${_id} not found!`,
        });
    }

    res.json({
        status: 200,
        message: 'Successfully found contact!',
        data,
    });
}));

// Додавання нового контакту
router.post('/contacts', ctrlWrapper(async (req, res) => {
    const data = await ContactsCollection.create(req.body);
    res.status(201).json({
        status: 201,
        message: 'Contact successfully created!',
        data,
    });
}));

// Оновлення існуючого контакту
router.patch('/contacts/:_id', ctrlWrapper(async (req, res) => {
    const { _id } = req.params;
    const updatedContact = await ContactsCollection.findByIdAndUpdate(_id, req.body, { new: true });

    if (!updatedContact) {
        return res.status(404).json({
            status: 404,
            message: `Contact with id=${_id} not found!`,
        });
    }

    res.json({
        status: 200,
        message: 'Contact successfully updated!',
        data: updatedContact,
    });
}));

// Видалення контакту
router.delete('/contacts/:_id', ctrlWrapper(async (req, res) => {
    const { _id } = req.params;
    const deletedContact = await ContactsCollection.findByIdAndDelete(_id);

    if (!deletedContact) {
        return res.status(404).json({
            status: 404,
            message: `Contact with id=${_id} not found!`,
        });
    }

    res.json({
        status: 200,
        message: 'Contact successfully deleted!',
        data: deletedContact,
    });
}));

export default router;
