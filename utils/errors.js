const BAD_REQUEST_CODE = 400;
const FORBIDDEN = 403;
const NOT_FOUND_CODE = 404;
const CONFLICT = 409;
const INT_SERVER_ERROR_CODE = 500;

/**
 * Determines the type of error that was thrown and returns it to the user
 * @param {object} res
 * @param {object} error
 * @returns
 */
const returnError = (res, error) => {
  console.error(error);
  console.error(`ERROR NAME: ${error.name}`);
  console.error(`ERROR CODE: ${error.code}`);

  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.name === "Error"
  ) {
    return res.status(BAD_REQUEST_CODE).send({ message: error.message });
  }
  if (error.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND_CODE).send({ message: error.message });
  }
  if (error.name === "MongoServerError") {
    return res.status(CONFLICT).send({ message: error.message });
  }
  return res.status(INT_SERVER_ERROR_CODE).send({
    message: `${INT_SERVER_ERROR_CODE}: an unknown error has occurred`,
  });
};

module.exports = {
  returnError,
  BAD_REQUEST_CODE,
  FORBIDDEN,
  NOT_FOUND_CODE,
  INT_SERVER_ERROR_CODE,
};
