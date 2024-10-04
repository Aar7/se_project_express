const userRouter = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

userRouter.get("/me", getCurrentUser);
userRouter.patch("/me", updateProfile);

module.exports = userRouter;
