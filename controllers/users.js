const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { returnError, BAD_REQUEST_CODE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/customErrors");

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
    // returnError(res, error);
    // if (
    //   error.message === "TypeError: Data must be a string or a buffer" ||
    //   error.message === "Error: Invalid number of rounds" ||
    //   error.message === "Error: bcrypt: invalid salt" ||
    //   error.message === "Error: bcrypt: not a valid hash" ||
    //   error.message === "Error: Invalid hash string" ||
    //   error.message ===
    //     "Error: Hash has already been created, cannot hash again" ||
    //   error.message === "Error: Out of memory" ||
    //   error.message === "Error: Failed to build bcrypt" ||
    //   error.message ===
    //     "UnhandledPromiseRejectionWarning: Error: bcrypt: invalid salt"
    // ) {
    next(error);
    // }
  }
};

const login = (req, res, next) => {
  console.log(`backend login called`);
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    // return res
    //   .status(BAD_REQUEST_CODE)
    //   .send({ message: "Email and password are required" });
    next(new BadRequestError("Email and password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { name, email, avatar, _id } = user;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ token, name: name, email: email, avatar: avatar, _id: _id });
    })
    .catch((error) => {
      console.log("catch block");
      // returnError(res, error);
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
        if (!user) {
          next(new NotFoundError("User cannot be found :("));
        }
        res.send(user);
      });
  } catch (error) {
    // returnError(res, error);
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
    // return res.status(BAD_REQUEST_CODE).send({ message: "Fields empty" });
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
    // return returnError(res, error);
    if (error.name === "DocumentNotFoundError") {
      next(
        new NotFoundError(
          "User profile-information could not be found and updated"
        )
      );
    }
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
