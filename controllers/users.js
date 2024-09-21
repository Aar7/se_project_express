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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      returnError(res, error);
    });
};

module.exports = { getUsers, getUser, createUser };
