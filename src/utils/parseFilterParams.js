const filterType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isKnownType = ['work', 'home', 'personal'].includes(type);

  if (isKnownType) return type;
};

const filterIsFavorite = (param) => {
  const isString = typeof param === 'string';

  if (!isString) return;

  const isBoolean = ['true', 'false'].includes(param);

  if (isBoolean) return param;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = filterType(contactType);
  const parsedIsFavourite = filterIsFavorite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
