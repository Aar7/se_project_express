const signinRouter = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  validateNewUserInfo,
  validateUserLogin,
} = require("../middlewares/validation");

signinRouter.post("/signup", validateNewUserInfo, createUser);
signinRouter.post("/signin", validateUserLogin, login);

module.exports = signinRouter;
