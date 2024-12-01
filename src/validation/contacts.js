import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

export const contactsAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Invalid name format',
    'string.empty': 'Name cannot be an empty field',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number must be a string',
    'string.empty': 'Phone number is required',
    'string.min': 'Phone number should have at least 3 characters',
    'string.max': 'Phone number should have at most 20 characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'Invalid email format',
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email cannot be empty',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .required()
    .messages({
      'string.base': 'Contact type must be a string',
      'any.only': `Contact type must be one of: ${typeList.join(', ')}`,
      'any.required': 'Contact type is required',
    }),
});

export const contactsPatchSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Invalid name format',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number must be a string',
    'string.min': 'Phone number should have at least 3 characters',
    'string.max': 'Phone number should have at most 20 characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'Invalid email format',
    'string.email': 'Please enter a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .messages({
      'string.base': 'Contact type must be a string',
      'any.only': `Contact type must be one of: ${typeList.join(', ')}`,
    }),
});
