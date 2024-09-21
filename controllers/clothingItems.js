const ClothingItem = require("../models/clothingItem");
const { docNotFound, returnError } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find()
    .orFail(docNotFound)
    .then((items) => res.send(items))
    .catch((error) => returnError(res, error));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((error) => {
      returnError(res, error);
      // res
      //   .status(500)
      //   .send({ message: "There was an issue creating this item" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .orFail(docNotFound)
    .then((item) => res.send({ data: item }))
    .catch((error) => returnError(res, error));
};

module.exports = { getItems, createItem, deleteItem };
