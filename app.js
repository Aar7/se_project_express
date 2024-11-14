require("dotenv").config();
const { errors } = require("celebrate");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const limiter = require("./utils/rateLimiter");

const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to database\n\n\n\n\n"))
  .catch(console.error);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://www.aarwtwr.fairuse.org"
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(helmet());
app.disable("x-powered-by");
app.use(limiter);
app.use(express.json());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", mainRouter);

app.use(errorLogger);

// error handlers
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening from port ${PORT}...`);
});
