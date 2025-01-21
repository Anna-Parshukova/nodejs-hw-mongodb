import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactById = async ({ userId, contactId }) => {
  const contact = await ContactsCollection.findOne({ userId, _id: contactId });

  return contact;
};

export const createContact = async ({ userId, body }) => {
  const newContact = await ContactsCollection.create({ userId, ...body });

  return newContact;
};


export const updateContact = async ({ _id, body, options, userId }) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id, userId },
    body,
    { includeResultMetadata: true, ...options },
  );

  if (!updatedContact || !updatedContact.value) return null;

  return {
    contact: updatedContact.value,
    isNew: updatedContact?.lastErrorObject?.upserted,
  };
};

export const deleteContact = async ({ _id, userId }) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id,
    userId,
  });
  return deletedContact;
};
