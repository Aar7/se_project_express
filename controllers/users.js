const User = require("../models/user");
const { docNotFound, returnError } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find()
    .orFail(docNotFound)
    .then((users) => res.send(users))
    .catch((error) => {
      returnError(res, error);
      // res.status(500).send({ message: "Error from getUsers" });
    });
};

const getUser = (req, res) => {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    .orFail(docNotFound)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      returnError(res, error);
      // res.status(500).send({ message: "User not found" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      returnError(res, error);
      // res.status(500).send({ message: "Error creating user" });
    });
};

module.exports = { getUsers, getUser, createUser };
