const { default: mongoose } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { returnError, FORBIDDEN } = require("../utils/errors");

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
  ClothingItem.findOne({ _id: req.params.itemId })
    .orFail()
    .then((item) => {
      const userId = JSON.stringify(new mongoose.Types.ObjectId(req.user._id));
      const ownerId = JSON.stringify(item.owner);
      if (ownerId !== userId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "User action not allowed" });
      }
      return ClothingItem.findByIdAndRemove(req.params.itemId)
        .orFail()
        .then((removedItem) => res.send({ data: removedItem }));
    })
    .catch((error) => returnError(res, error));
};

const likeItem = (req, res) => {
  console.log("req.params.itemId: ", req.params.itemId);
  console.log("req.user._id: ", req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      console.log("Item from likeItem on backend: ", item);
      res.send({ data: item });
    })
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
