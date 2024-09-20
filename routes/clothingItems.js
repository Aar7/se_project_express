const clothingItemsRouter = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
// get user data

clothingItemsRouter.get("/items", getItems);
clothingItemsRouter.post("/items", createItem);
clothingItemsRouter.delete("/items:itemId", deleteItem);

module.exports = clothingItems;
