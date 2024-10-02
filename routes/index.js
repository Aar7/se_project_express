const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { NOT_FOUND_CODE } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.use("/users", auth, userRouter);
// router.use("/signin", userRouter);
// router.use("/signup", userRouter);
router.use("/items", clothingItemsRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Route does not exist" });
});

module.exports = router;
