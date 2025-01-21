import createHttpError from 'http-errors';

export const notFoundHandler = (req, _res, _next) => {
  throw createHttpError(404, `Route ${req.url} not found`);
};
