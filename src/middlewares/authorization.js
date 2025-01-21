import createHttpError from 'http-errors';

export const authorization = (req, res, next) => {
  const user = req.user;
  if (!user) {
    next(createHttpError(401));
    return;
  }
  next();
};
