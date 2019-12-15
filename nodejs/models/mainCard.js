const Joi = require("joi");
const mongoose = require("mongoose");

const MainCard = mongoose.model(
  "MainCard",
  new mongoose.Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    onergeyiVeren: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true,
      default: "no-url"
    },
    backgroundImage: {
      type: String
    },
    agree: Number,
    disagree: Number,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    expired: {
      type: Boolean,
      default: false
    },
    meclis: {
      type: Object
    }
  })
);

function validateMainCard(mainCard) {
  const schema = {
    text: Joi.string()
  };

  return Joi.validate(mainCard, schema);
}

exports.MainCard = MainCard;
exports.validate = validateMainCard;
