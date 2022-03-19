const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  location: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  name: { type: String, required: true },
  nickName: { type: String, required: true, unique: true },
  image: { type: String },
  description: { type: String },
});

module.exports = model('User', userSchema);
