const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // password2: {
  //   type: String,
  //   required: [true, 'password is required'],
  // },
  // location: {
  //   type: String,
  //   required: true,
  // },
  // age: {
  //   type: Number,
  //   required: true,
  // },
  name: { type: String, required: true },
});

module.exports = model('User', userSchema);
