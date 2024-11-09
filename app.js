const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const signinRouter = require("./routes/signins");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to database\n\n\n\n\n"))
  .catch(console.error);

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/", signinRouter);
app.use("/", mainRouter);

app.use(errorLogger);

// error handlers
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening from port ${PORT}...`);
});
