const User = require("../models/user");
// getUsers, getUser, and createUser
getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: "Error from getUsers" }));
};

getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return Promise.reject("User not found");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: "User not found" });
    });
};

createUser = (req, res) => {
  const { name, avatar } = req.body;
  // console.log(req.body);
  console.log("createUser run");
  // res.send("Response from createUser");

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Error creating user" }));
};

module.exports = { getUsers, getUser, createUser };
