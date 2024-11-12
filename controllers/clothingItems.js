const { default: mongoose } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../middlewares/BadRequestError");
const UnauthorizedError = require("../middlewares/UnauthorizedError");
const NotFoundError = require("../middlewares/NotFoundError");
const ConflictError = require("../middlewares/ConflictError");

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => {
      if (!items) {
        throw new NotFoundError("Items could not be found...");
      }
      res.send(items);
    })
    // .catch((error) => returnError(res, error));
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((error) => {
      if (error.name === "MongoError") {
        next(new ConflictError("An item with identical data already exists"));
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
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "User action not allowed" });
        next(new UnauthorizedError("User action not allowed"));
      }
      return ClothingItem.findByIdAndRemove(req.params.itemId)
        .orFail()
        .then((removedItem) => res.send({ data: removedItem }));
    })
    // .catch((error) => returnError(res, error));
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("Invalid card information"));
      }
    });
};

const likeItem = (req, res, next) => {
  // console.log("req.params.itemId: ", req.params.itemId);
  // console.log("req.user._id: ", req.user._id);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    // 222,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Card was not found...");
      }
      console.log("Item from likeItem on backend: ", item);
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("The requested document could not be found"));
      } else {
        next(error);
      }
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
      if (!item) {
        throw new NotFoundError("Card was not found...");
      }
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError" || error.name === "CastError") {
        next(new BadRequestError("The requested document could not be found"));
      } else {
        next(error);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
