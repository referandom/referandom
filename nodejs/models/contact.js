const Joi = require("joi");
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Contact = mongoose.model("Contact", contactSchema);

exports.Contact = Contact;
