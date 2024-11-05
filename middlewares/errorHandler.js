function errorHandler(err, req, res, next) {
  console.warn("errorHandler called");
  console.error(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "A server error has occurred..." : message,
  });
  return res.status(500).send({ message: "A server error has occurred..." });
}

module.exports = errorHandler;
