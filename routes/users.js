const userRouter = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

userRouter.post("/signin", login);
userRouter.post("/signup", createUser);
userRouter.get("/me", getCurrentUser);
userRouter.patch("/me", updateProfile);

module.exports = userRouter;
