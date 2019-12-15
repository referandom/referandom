const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/me/:id", [auth], async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate({
      path: "votedCards.mainCard",
      populate: { path: "comments", populate: { path: "owner" } }
    });
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate({
      path: "votedCards.mainCard"
    });
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user =
    (await User.findOne({ email: req.body.email })) ||
    (await User.findOne({ username: req.body.username }));
  if (user) return res.status(400).send("Kayıtlı kullanıcı adı ya da email.");

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/:id", [auth], async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The User with the given ID was not found.");

  res.send(user);
});

module.exports = router;
