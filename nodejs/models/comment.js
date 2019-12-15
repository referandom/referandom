const Joi = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  vote: {
    type: Boolean,
    required: true
  },
  upvotedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  upvote: {
    type: Number,
    required: true
  },
  date: {
    type: String
  },
  mainCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCard"
  }
});

const Comment = mongoose.model("Comment", commentSchema);

function validateComment(comment) {
  const schema = {
    owner: Joi.objectId().required(),
    text: Joi.string().required(),
    upvotedUsers: Joi.array(),
    vote: Joi.boolean().required(),
    upvote: Joi.number().required(),
    date: Joi.string().required(),
    mainCardId: Joi.objectId().required()
  };

  return Joi.validate(comment, schema);
}

exports.Comment = Comment;
exports.validate = validateComment;
exports.commentSchema = commentSchema;
