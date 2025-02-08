const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  id: Number,
});


module.exports = linkSchema;
