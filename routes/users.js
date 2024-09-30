const userRouter = require("express").Router();
const { createUser, login } = require("../controllers/users");

userRouter.post("/signin", login);
userRouter.post("/signup", createUser);

module.exports = userRouter;
