const router = require("express").Router();

const signinRouter = require("./signins");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const NotFoundError = require("../middlewares/NotFoundError");

router.use("/", signinRouter);
router.use("/users", auth, userRouter);
router.use("/items", clothingItemsRouter);
router.use(() => {
  throw new NotFoundError("Route does not exist");
});

module.exports = router;
