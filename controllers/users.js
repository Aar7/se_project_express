const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { returnError } = require("../utils/errors");
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
        res.send({ data: user });
      })
      .catch((error) => {
        returnError(res, error);
      });
  });
};

const login = (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;
  // authentication: ensuring that the email and password match database entries
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt
        .sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        })
        .then((response) => {
          res.send(token);
        });
    })
    .catch((error) => {
      res.status(401).send({ message: error.message });
    });
  // if authentication passes, create a JWT with 1 week life
};

module.exports = { getUsers, getUser, createUser, login };
