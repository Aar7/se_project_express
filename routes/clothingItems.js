const clothingItemsRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateItemInfo,
  validateDocumentId,
} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", auth, validateItemInfo, createItem);
clothingItemsRouter.delete("/:itemId", auth, validateDocumentId, deleteItem);
clothingItemsRouter.put("/:itemId/likes", auth, validateDocumentId, likeItem);
clothingItemsRouter.delete(
  "/:itemId/likes",
  auth,
  validateDocumentId,
  dislikeItem
);

module.exports = clothingItemsRouter;
