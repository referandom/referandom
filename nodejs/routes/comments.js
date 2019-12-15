const { Comment, validate } = require("../models/comment");
const { MainCard } = require("../models/mainCard");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", [auth], async (req, res) => {
  let comment = new Comment({ ...req.body });
  comment = await comment.save();

  let mainCard = await MainCard.findById(req.body.mainCardId);
  if (!mainCard)
    return res
      .status(404)
      .send("The mainCard with the given ID was not found.");

  mainCard.comments.push(comment._id);
  mainCard = await mainCard.save();

  res.send(comment);
});

router.put("/:id", [auth], async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details);

  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

router.delete("/:id", [auth], async (req, res) => {
  const comment = await Comment.findByIdAndRemove(req.params.id);
  if (!comment)
    return res.status(404).send("The comment with the given ID was not found.");

  res.send(comment);
});

router.get("/", async (req, res) => {
  const comments = await Comment.find();
  res.send(comments);
});

module.exports = router;
