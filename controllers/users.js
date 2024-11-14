const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../middlewares/BadRequestError");
const NotFoundError = require("../middlewares/NotFoundError");
const ConflictError = require("../middlewares/ConflictError");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    const pwordHash = await bcrypt.hash(password, 14);
    const user = await User.create({
      name,
      avatar,
      email,
      password: pwordHash,
    });

    res.send({
      data: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError("One or more fields of data already exist"));
    } else if (error.name === "ValidationError") {
      next(new BadRequestError("Some data entered is invalid"));
    }
    next(error);
  }
};

const login = (req, res, next) => {
  console.log(`backend login called`);
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { name, userEmail, avatar, _id } = user;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ token, name, email: userEmail, avatar, _id });
    })
    .catch((error) => {
      console.log("catch block");
      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  console.error(req.user);
  try {
    const userId = req.user._id;

    User.findById(userId)
      .orFail()
      .then((user) => {
        res.send(user);
      });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      next(new NotFoundError("User cannot be found :("));
    }
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  if (name === undefined && avatar === undefined) {
    next(new BadRequestError("Fields are empty"));
  }

  try {
    const update = {};

    update.name = name;
    update.avatar = avatar;

    const currentUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).orFail();

    return res.send(currentUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(new BadRequestError("Some data entered is invalid"));
    } else if (error.name === "DocumentNotFoundError") {
      return next(
        new NotFoundError(
          "User profile-information could not be found and updated"
        )
      );
    }
    return next(error);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
