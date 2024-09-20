const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to database"))
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "66eddbd0382b6d8a70865d3d",
  };
  next();
});
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};
app.use(express.json());
app.use("/", mainRouter);
// app.use("/", clothingItemsRouter);

app.listen(PORT, () => {
  console.log(`Listening from port ${PORT}...`);
});
