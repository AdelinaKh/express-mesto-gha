const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Minimum length is 2'],
    maxlength: [30, 'Maximum length is 30'],
  },
  about: {
    type: String,
    required: [true, 'About is required'],
    minlength: [2, 'Minimum length is 2'],
    maxlength: [30, 'Maximum length is 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is required'],
  },
});

module.exports = mongoose.model('user', userSchema);
