const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      min: 3,
      max: 160,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {}, //empty object means it can be of any type
      required: true,
      min: 200,
      max: 2000000,
    },
    excerpt: {
      type: String,
      max: 1000,
    },
    mtitle: {
      type: String,
    },
    mdesc: {
      type: String,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    tags: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Tags", required: true },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
