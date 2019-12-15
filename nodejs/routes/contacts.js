const { Contact } = require("../models/contact");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const contact = new Contact({ ...req.body });

  await contact.save();
  res.send(contact);
});

module.exports = router;
