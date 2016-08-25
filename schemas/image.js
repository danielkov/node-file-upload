const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'No title'
  },
  src: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now()
  }
})
