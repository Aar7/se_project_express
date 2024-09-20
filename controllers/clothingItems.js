const ClothingItem = require("../models/clothingItem");
// getItems, createItem, deleteItem

getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((err) =>
      res.status(500).send({ message: "Error getting clothing items" })
    );
};

createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((err) =>
      res.status(500).send({ message: "There was an issue creating this item" })
    );
};

deleteItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params._id)
    .then((item) => res.send({ data: item }))
    .catch((err) =>
      res.status(500).send({ message: "Cannot remove specified resource" })
    );
};

module.exports = { getItems, createItem, deleteItem };
