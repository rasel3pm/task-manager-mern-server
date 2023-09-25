const express = require("express");
const router = require("./src/router/api");
const app = new express();
const bodyParser = require("body-parser");

//Security Middleware
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");

//Database
const mongoose = require("mongoose");
const path = require("path");

//Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
//Body perser
app.use(bodyParser.json());
//mongodb Connection
let URL =
  "mongodb+srv://<username>:<password>@cluster0.7dgocwt.mongodb.net/Task-app?retryWrites=true&w=majority";
let option = { user: "rasel11", pass: "rasel11", autoIndex: true };

mongoose
  .connect(URL, option)
  .then((res) => {
    console.log("Database Connect");
  })
  .catch((err) => {
    console.log(err);
  });

//Rate Limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 100, max: 3000 });
app.use(limiter);
//Database
// Managing BackEnd API Routing
app.use("/api/v1", router);
app.get("*", function (res, res) {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = app;
