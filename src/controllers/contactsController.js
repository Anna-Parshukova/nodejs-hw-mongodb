import ContactsCollection from '../db/contactModel.js';

export const getContacts = async (req, res) => {
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
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const data = await ContactsCollection.findById(id);

  if (!data) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id=${id} not found!`,
    });
  }

  res.json({
    status: 200,
    message: 'Successfully found contact!',
    data,
  });
};

export const createContact = async (req, res) => {
  const data = await ContactsCollection.create(req.body);
  res.status(201).json({
    status: 201,
    message: 'Contact successfully created!',
    data,
  });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await ContactsCollection.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedContact) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id=${id} not found!`,
    });
  }

  res.json({
    status: 200,
    message: 'Contact successfully updated!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await ContactsCollection.findByIdAndDelete(id);

  if (!deletedContact) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id=${id} not found!`,
    });
  }

  res.status(204).send();
};
