const express = require("express");
const app = express();
const pool = require("./config.js");
const router = require("./routes/index.js");
const errorHandler = require("./middlewares/errorhandler.js");
const morgan = require("morgan");

pool.connect((err, res) => {
  if (err) console.log(err);
  console.log("connected");
});

app.use(morgan("tiny"));
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(3000);
