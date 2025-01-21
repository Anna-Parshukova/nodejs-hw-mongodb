import { model, Schema } from 'mongoose';

import { contactsTypeList } from '../../constants/index.js';

import { handleSaveError, setupUpdateValidator } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: true,
      enum: contactsTypeList,
      default: 'personal',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    photo: { type: String },
  },
  { timestamps: true, versionKey: false },
);

contactsSchema.post('save', handleSaveError);

contactsSchema.pre('findOneAndUpdate', setupUpdateValidator);

contactsSchema.post('findOneAndUpdate', handleSaveError);

export const ContactsCollection = model('contacts', contactsSchema);
