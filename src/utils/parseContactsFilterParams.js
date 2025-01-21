const parseValue = (value) => {
  const isString = typeof value === 'string';

  if (!isString) return;

  const isFavourite = (value) => ['true', 'false'].includes(value);

  if (isFavourite(value)) return value;
  return;
};

export const parseFilterParams = (query) => {
  const { isFavourite } = query;

  const parsedIsFavourite = parseValue(isFavourite);

  return {
    isFavourite: parsedIsFavourite,
  };
};
