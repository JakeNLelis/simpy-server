// unsupported endpoint handlers

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// error middleware
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred." });
};

module.exports = { notFound, errorHandler };
