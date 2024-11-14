const { default: mongoose } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../middlewares/BadRequestError");
const NotFoundError = require("../middlewares/NotFoundError");
const ForbiddenError = require("../middlewares/ForbiddenError");

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => {
      if (!items) {
        throw new NotFoundError("Items could not be found...");
      }
      res.send(items);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("An item with identical data already exists"));
      }
      next(error);
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findOne({ _id: req.params.itemId })
    .orFail()
    .then((item) => {
      const userId = JSON.stringify(new mongoose.Types.ObjectId(req.user._id));
      const ownerId = JSON.stringify(item.owner);
      if (ownerId !== userId) {
        next(new ForbiddenError("User action not allowed"));
      }
      return ClothingItem.findByIdAndRemove(req.params.itemId)
        .orFail()
        .then((removedItem) => res.send({ data: removedItem }));
    })
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid card information"));
      } else if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("The requested resource could not be found"));
      }
      next(error);
    });
};

const likeItem = (req, res, next) => {
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
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("The requested document could not be found"));
      } else if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("The requested resource could not be found"));
      }
      next(error);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("The requested document could not be found"));
      } else if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("The requested resource could not be found"));
      }
      next(error);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
