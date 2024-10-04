const signinRouter = require("express").Router();
const { login, createUser } = require("../controllers/users");

signinRouter.post("/signup", createUser);
signinRouter.post("/signin", login);

module.exports = signinRouter;
