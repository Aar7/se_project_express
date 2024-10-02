const clothingItemsRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", auth, createItem);
clothingItemsRouter.delete("/:itemId", auth, deleteItem);
clothingItemsRouter.put("/:itemId/likes", auth, likeItem);
clothingItemsRouter.delete("/:itemId/likes", auth, dislikeItem);

module.exports = clothingItemsRouter;
