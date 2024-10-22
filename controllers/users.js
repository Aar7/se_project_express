const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { returnError, BAD_REQUEST_CODE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
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
    returnError(res, error);
  }
};

const login = (req, res) => {
  console.log(`backend login called`);
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_CODE)
      .send({ message: "Email and password are required" });
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
      returnError(res, error);
    });
};

const getCurrentUser = (req, res) => {
  console.error(req.user);
  try {
    const userId = req.user._id;

    User.findById(userId)
      .orFail()
      .then((user) => res.send(user));
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
