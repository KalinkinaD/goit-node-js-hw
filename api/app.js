const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./routers/contact.router");

const PORT = process.env.PORT || 8080;

module.exports = class Server {
  constructor() {
    this.server = null;
  }
  start() {
    this.server = express();
    this.initMiddleware();
    this.initRouters();
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

  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening on port", PORT);
    });
  }
};
