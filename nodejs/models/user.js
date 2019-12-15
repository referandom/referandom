const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
  website: {
    type: String,
    default: "Website eklenmedi"
  },
  status: {
    type: String,
    default: "Kişisel bilgi eklenmedi."
  },
  ppLink: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/refern-7c476.appspot.com/o/candidate.png?alt=media&token=202833cb-3834-49bc-94b9-a69b27710616"
  },
  location: {
    type: String,
    default: "Lokasyon eklenmedi",
    required: true,
    trim: true
  },
  votedCards: [
    {
      mainCard: { type: mongoose.Schema.Types.ObjectId, ref: "MainCard" },
      vote: Boolean
    }
  ],
  numberOfVote: {
    type: Number,
    default: 0,
    required: true
  },
  numberOfComment: {
    type: Number,
    default: 0,
    required: true
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string(),
    surname: Joi.string(),
    website: Joi.string(),
    status: Joi.string(),
    isAdmin: Joi.boolean(),
    ppLink: Joi.string(),
    location: Joi.string(),
    votedCards: Joi.array(),
    numberOfVote: Joi.number(),
    numberOfComment: Joi.number()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
