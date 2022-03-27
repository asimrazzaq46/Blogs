const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const bodyparser = require("body-Parser");

//imports local
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categories/categoriesRoutes");
const tagsRoutes = require("./routes/tags/tagsRoutes");
const blogRoutes = require("./routes/blogs/blogRoutes");
const app = express();

// Setting Up config files
dotenv.config({ path: "./config/config.env" });
app.use(express.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagsRoutes);
app.use("/api", blogRoutes);

module.exports = app;
