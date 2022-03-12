const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },
    permissionLevel: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
