import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';


export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const userId = req.user._id;


  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};


export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id.toString();

  const contact = await getContactById({ userId, contactId });

  if (!contact) {
    throw createHttpError(404, `Contact whit id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};


export const createContactController = async (req, res) => {
  const userId = req.user._id;

  let photoUrl;
  const photo = req.file;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const body = { ...req.body, photo: photoUrl };

  const newContact = await createContact({ userId, body });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId: _id } = req.params;
  const userId = req.user._id;

  let photoUrl;

  const photo = req.file;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const options = {};
  const body = { ...req.body, photo: photoUrl };

  const updContact = await updateContact({ _id, body, options, userId });

  if (updContact === null) {
    next(createHttpError(404, `Contact whith id ${_id} not found`));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updContact.contact,
  });
};


export const deleteContactController = async (req, res, next) => {
  const { contactId: _id } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact({ _id, userId });

  if (!deletedContact) {
    next(createHttpError(404, `Contact with id ${_id} not found`));
    return;
  }

  res.status(204).json({ status: 204 });
};


export const upsertContactController = async (req, res, next) => {
  const { contactId: _id } = req.params;

  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const body = { ...req.body, photo: photoUrl };
  const options = { upsert: true };

  const upsertContact = await updateContact({
    _id,
    body,
    options,
    userId,
  });

  if (!upsertContact) {
    next(createHttpError(404, 'Not found'));
    return;
  }

  const status = upsertContact.isNew ? 201 : 200;
  res.status(status).json({
    status: status,
    message: 'Successfully upserted a contact!',
    data: upsertContact.contact,
  });
};
