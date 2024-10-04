const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { returnError, BAD_REQUEST_CODE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_CODE)
      .send({ message: "Email and password are required" });
  }
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

    User.findById(userId)
      .orFail()
      .then((user) => {
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

    update.name = name;
    update.avatar = avatar;

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
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
