const dotenv = require("dotenv");

const connectDatabase = require("./config/mongodb");
const app = require("./index");

// Handled Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to Uncaught Exceptions");
  process.exit(1);
});

// Setting Up config files
dotenv.config({ path: "./config/config.env" });

// connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port: ${process.env.PORT}.`);
});

// Handled Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(
    `Shutting down the server due to unhandled promise rejections...`
  );
  server.close(() => {
    process.exit(1);
  });
});
