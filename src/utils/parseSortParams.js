const sortOrderList = ['asc', 'desc'];

export const parseSortParams = ({ sortOrder, sortBy }, sortByList) => {
  const parseSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrder[0];
  const parseSortBy = sortByList.includes(sortBy) ? sortBy : '_id';

  return { sortBy: parseSortBy, sortOrder: parseSortOrder };
};
