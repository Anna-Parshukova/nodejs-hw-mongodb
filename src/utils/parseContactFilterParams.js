import { typeList } from '../constants/contacts.js';

const parseContactType = (contactType) => {
  if (typeof contactType !== `string`) return;
  const isContactType = typeList.includes(contactType);
  if (isContactType) return contactType;
};
const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== `string`) return;

  if (isFavourite === 'true') return 'true';
  if (isFavourite === 'false') return 'false';
};

export const parseContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
