const signinRouter = require("express").Router();
const { login, createUser } = require("../controllers/users");
const errorHandler = require("../middlewares/errorHandler");

signinRouter.post("/signup", errorHandler, createUser);
signinRouter.post("/signin", errorHandler, login);

module.exports = signinRouter;
