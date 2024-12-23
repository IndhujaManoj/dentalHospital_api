const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  beforeImageUrl: {
    type: String,
    required: true
  },
  afterImageUrl: {
    type: String,
    required: true
  },
  beforeImage2Url: String,
  afterImage2Url: String
});

const Image = mongoose.model("Image", imageSchema);

module.exports = { Image };
