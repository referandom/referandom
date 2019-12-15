const express = require("express");
const mainCards = require("../routes/mainCards");
const comments = require("../routes/comments");
const users = require("../routes/users");
const auth = require("../routes/auth");
const contacts = require("../routes/contacts");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/main-cards", mainCards);
  app.use("/api/comments", comments);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/contacts", contacts);
  app.use(error);
};
