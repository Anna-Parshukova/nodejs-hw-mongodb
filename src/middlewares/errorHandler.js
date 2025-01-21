export const errorHandler = (err, req, res, next) => {
  console.log(`Помилка еррор хендлер" :${err}`);

  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).json({
    status,
    message,
    data: err.message,
  });
};
