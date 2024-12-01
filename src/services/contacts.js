import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
}) => {
  const skipQuery = (page - 1) * perPage;

  const query = ContactCollection.find();
  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    query.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.userId) {
    query.where('userId').equals(filter.userId);
  }

  const [totalItems, data] = await Promise.all([
    ContactCollection.find().merge(query).countDocuments(),
    query
      .skip(skipQuery)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);
  const paginationData = calculatePaginationData({ totalItems, page, perPage });
  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (contactId, userId) =>
  ContactCollection.findOne({ _id: contactId, userId });

export const postContacts = (payload) => ContactCollection.create(payload);

export const patchContacts = (contactId, userId, payload) =>
  ContactCollection.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });

export const deleteContactById = (contactId, userId) =>
  ContactCollection.findByIdAndDelete({ _id: contactId, userId });
