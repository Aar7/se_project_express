const userRouter = require("express").Router();
const { getUser, getUsers, createUser } = require("../controllers/users");

userRouter.get("/", getUsers);
userRouter.get("/:userId", getUser);
userRouter.post("/", createUser);

module.exports = userRouter;
