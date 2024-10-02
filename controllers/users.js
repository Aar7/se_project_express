const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  returnError,
  NOT_FOUND_CODE,
  INT_SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((error) => {
      returnError(res, error);
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(/* docNotFound */)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      returnError(res, error);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 14).then((password) => {
    User.create({ name, avatar, email, password })
      .then((user) => {
        res.send({
          data: {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          },
        });
      })
      .catch((error) => {
        returnError(res, error);
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ token });
    })
    .catch((error) => {
      console.log("catch block");
      returnError(res, error);
    });
};

const getCurrentUser = (req, res) => {
  console.error(req.user);
  try {
    const userId = req.user._id;

    User.findById(userId).then((user) => {
      if (!user) {
        returnError(res, error);
        throw new Error("User not found");
      }
      return res.send(user);
    });
  } catch (error) {
    returnError(res, error);
  }
};

const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  if (name === undefined && avatar === undefined) {
    return res.status(BAD_REQUEST_CODE).send({ message: "Fields empty" });
  }

  try {
    const update = {};

    if (name !== undefined) {
      update.name = name;
    }
    if (avatar !== undefined) {
      update.avatar = avatar;
    }

    const currentUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).orFail();

    return res.send(currentUser);
  } catch (error) {
    return returnError(res, error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
