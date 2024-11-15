import { Router } from 'express';
import ContactsCollection from '../db/contactModel.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();


router.get('/contacts', ctrlWrapper(async (req, res) => {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const skip = (page - 1) * perPage;
    const filter = {};
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const totalItems = await ContactsCollection.countDocuments(filter);
    const data = await ContactsCollection.find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(Number(perPage));

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: {
            data,
            page: Number(page),
            perPage: Number(perPage),
            totalItems,
            totalPages: Math.ceil(totalItems / perPage),
            hasPreviousPage: page > 1,
            hasNextPage: page * perPage < totalItems,
        },
    });
}));

router.get('/contacts/:_id', isValidId, ctrlWrapper(async (req, res) => {
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


router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(async (req, res) => {
    const data = await ContactsCollection.create(req.body);
    res.status(201).json({
        status: 201,
        message: 'Contact successfully created!',
        data,
    });
}));


router.patch('/contacts/:_id', isValidId, validateBody(updateContactSchema), ctrlWrapper(async (req, res) => {
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


router.delete('/contacts/:_id', isValidId, ctrlWrapper(async (req, res) => {
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
