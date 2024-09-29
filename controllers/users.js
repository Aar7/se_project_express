const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { returnError } = require("../utils/errors");

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
        res.send({ data: user });
      })
      .catch((error) => {
        returnError(res, error);
      });
  });
};

module.exports = { getUsers, getUser, createUser };
