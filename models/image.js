const mongoose = require('mongoose'),
      schema = require('../schemas/image');

module.exports = mongoose.model('image', schema);
