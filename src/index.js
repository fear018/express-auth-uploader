require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./services/router");
const errorsHandler = require("./middlewares/errorsHandler");

const port = process.env.PORT || 5000;
const host = "127.0.0.1";

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use("/static", express.static(__dirname + "/public"));
app.use(errorsHandler);

app.listen(port, host, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`App listening on port ${port}`);
});
