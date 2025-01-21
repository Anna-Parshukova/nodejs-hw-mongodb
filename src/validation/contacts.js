import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

export const contactsAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(20)
    .messages({ 'any.required': 'Name is required field' }),
  phoneNumber: Joi.string()
    .required()
    .min(3)
    .max(20)
    .messages({ 'any.required': 'Phone number is required field' }),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .required()
    .default('personal')
    .messages({ 'any.required': 'Contact type is required field' }),
});

export const contactsUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .default('personal'),
});
