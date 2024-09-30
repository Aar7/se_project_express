const userRouter = require("express").Router();
const { createUser, login, getCurrentUser } = require("../controllers/users");

userRouter.post("/signin", login);
userRouter.post("/signup", createUser);
userRouter.get("/me", getCurrentUser);

module.exports = userRouter;
