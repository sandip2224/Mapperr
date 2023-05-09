const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    min: 3,
    max: 20
  },
  email: {
    type: String,
    unique: true,
    required: true,
    max: 50
  },
  password: {
    type: String,
    required: true,
    min: 6
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema)