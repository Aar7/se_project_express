const userRouter = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateUserInfo } = require("../middlewares/validation");

userRouter.get("/me", getCurrentUser);
userRouter.patch("/me", validateUpdateUserInfo, updateProfile);

module.exports = userRouter;
