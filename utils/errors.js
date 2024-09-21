/**
 * Invalid data
 */
const error_400 = {
  statusCode: 400,
  statusMsg: "Invalid data",
};

/**
 * Resource not found
 */
const error_404 = {
  statusCode: 404,
  statusMsg: "Resource not found",
};

/**
 * Server error
 */
const error_500 = {
  statusCode: 500,
  statusMsg: "Server error",
};

/**
 * Throws an error when the requested resource cannot be found
 */
const docNotFound = () => {
  const error = new Error(error_404.statusMsg);
  error.statusCode = error_404.statusCode;
  throw error;
};

/**
 * Determines the type of error that was thrown and returns it to the user
 * @param {object} res
 * @param {object} error
 * @returns
 */
const returnError = (res, error) => {
  console.error(error);
  if (error.statusCode === error_404.statusCode) {
    return res
      .status(error_404.statusCode)
      .send({ message: error_404.statusMsg });
  } else {
    return res.status(error_500.statusCode).send({
      message: `${error_500.statusMsg}: an unknown error has occurred`,
    });
  }
};

module.exports = { docNotFound, returnError };
