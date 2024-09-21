const ClothingItem = require("../models/clothingItem");
const { returnError } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((error) => returnError(res, error));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((error) => {
      returnError(res, error);
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((error) => returnError(res, error));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((error) => returnError(res, error));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((error) => returnError(res, error));
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
