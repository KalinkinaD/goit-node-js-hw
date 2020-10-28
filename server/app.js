const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const contactRouter = require("./contacts/contact.router");

require("dotenv").config();

const PORT = process.env.PORT || 7000;

module.exports = class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.server = express();
    this.initMiddleware();
    this.initRouters();
    await this.initDataBase();
    this.listen();
  }
  initMiddleware() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(morgan("dev"));
  }
  initRouters() {
    this.server.use("/contacts", contactRouter);
  }
  async initDataBase() {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
    console.log("DataBase connection - successful");
  }
  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port", PORT);
    });
  }
};