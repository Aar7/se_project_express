const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("./UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("authorization from auth.js: ", authorization, "\n\n");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization error");
  }
  const token = authorization.replace("Bearer ", "");
  console.log("token from auth.js: ", token, "\n\n");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("paylod from auth.js: ", payload, "\n\n");
  } catch (error) {
    throw new UnauthorizedError("Authorization error");
  }
  req.user = payload;
  console.log("payload._id: ", payload._id);
  return next();
};
