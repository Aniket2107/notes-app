require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const app = express();

const { connectDB } = require("./config/db");
connectDB();

//rate-limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// middlewares
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(limiter);

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/search", require("./routes/search"));

module.exports = app;
