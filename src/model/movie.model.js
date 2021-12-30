const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      trim: true,
      max: 200,
    },
    Released: {
      type: Date,
      required: true,
    },
    Genre: {
      type: String,
      required: true,
    },
    Director: {
      type: String,
      required: true,
    },
    CreatedBy: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
