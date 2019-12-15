const { MainCard, validate } = require("../models/mainCard");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const mainCards = await MainCard.find().populate({
    path: "comments",
    populate: { path: "owner" }
  });
  res.send(mainCards);
});

router.get("/:id", async (req, res) => {
  const mainCards = await MainCard.findById(req.params.id).populate({
    path: "comments",
    populate: { path: "owner" }
  });
  res.send(mainCards);
});

router.put("/:id", [auth], async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details);

  const mainCard = await MainCard.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!mainCard)
    return res
      .status(404)
      .send("The mainCard with the given ID was not found.");

  res.send(mainCard);
});

module.exports = router;
