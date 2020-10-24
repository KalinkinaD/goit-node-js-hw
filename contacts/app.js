// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// const contactRouter = require("./contact.router");

// require("dotenv").config();

// const PORT = process.env.PORT || 8080;

// class Server {
//   constructor() {
//     this.server = null;
//   }
//   start() {
//     this.server = express();
//     this.initMiddleware();
//     this.initRouters();
//     this.errorHandler();
//     this.listen();
//   }
//   initMiddleware() {
//     this.server.use(express.json());
//     this.server.use(cors({ origin: "http://localhost:8080" }));
//     this.server.use(morgan("dev"));
//   }

//   initRouters() {
//     this.server.use("/contacts", contactRouter);
//   }

//   errorHandler() {
//     this.server.use((err, req, res, next) => {
//       if (err) {
//         const code = err.status ? err.status : 400;
//         res.status(code).send({ message: err.message });
//       }
//     });
//   }

//   listen() {
//     this.server.listen(PORT, () => {
//       console.log("Server is listening on port", PORT);
//     });
//   }
// }
// module.exports = Server;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./contact.router");

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
