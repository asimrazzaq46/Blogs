const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) =>
      console.log(`Database is connected with HOST: ${con.connection.host}`)
    );
};

module.exports = connectDatabase;
