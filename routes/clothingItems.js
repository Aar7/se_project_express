const clothingItemsRouter = require("express").Router();
const auth = require("../middlewares/auth");
const { errorHandler } = require("../middlewares/errorHandler");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", auth, errorHandler, createItem);
clothingItemsRouter.delete("/:itemId", auth, deleteItem);
clothingItemsRouter.put("/:itemId/likes", auth, likeItem);
clothingItemsRouter.delete("/:itemId/likes", auth, dislikeItem);

module.exports = clothingItemsRouter;
