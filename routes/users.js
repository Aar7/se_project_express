const userRouter = require("express").Router();
const { getUser, getUsers, createUser } = require("../controllers/users");

userRouter.get("/users", getUsers);
userRouter.get("users:userId", getUser);
userRouter.post("/users", createUser);
