// /**
//  * Invalid data
//  */
// const error_400 = {
//   statusCode: 400,
//   statusMsg: "Invalid data",
// };

// /**
//  * Resource not found
//  */
// const error_404 = {
//   statusCode: 404,
//   statusMsg: "Resource not found",
// };

// /**
//  * Server error
//  */
// const error_500 = {
//   statusCode: 500,
//   statusMsg: "Server error",
// };

BAD_REQUEST_CODE = 400;
NOT_FOUND_CODE = 404;
INT_SERVER_ERROR_CODE = 500;

/**
 * Throws an error when the requested resource cannot be found
 */
// const docNotFound = () => {
//   const error = new Error("Resource not found");
//   error.statusCode = 404;
//   throw error;
// };

/**
 * Determines the type of error that was thrown and returns it to the user
 * @param {object} res
 * @param {object} error
 * @returns
 */
const returnError = (res, error) => {
  console.log(error);
  console.error(error.name);

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(BAD_REQUEST_CODE).send({ message: error.message });
  } else if (error.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND_CODE).send({ message: error.message });
  } else {
    return res.status(INT_SERVER_ERROR_CODE).send({
      message: `${INT_SERVER_ERROR_CODE}: an unknown error has occurred`,
    });
  }
};

module.exports = { returnError };
