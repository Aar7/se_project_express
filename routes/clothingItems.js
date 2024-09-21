const clothingItemsRouter = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);

clothingItemsRouter.post("/", createItem);

clothingItemsRouter.delete("/:itemId", deleteItem);

clothingItemsRouter.put("/:itemId/likes", likeItem);
clothingItemsRouter.delete("/:itemId/likes", dislikeItem);

module.exports = clothingItemsRouter;
