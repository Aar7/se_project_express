const clothingItemsRouter = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", createItem);
clothingItemsRouter.delete("/:itemId", deleteItem);

module.exports = clothingItemsRouter;
