const express = require('express');
const Dog = require('../models/Dog.model');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

function profileRoutes() {
  const router = express.Router();

  router.get('/', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    console.log('test', userId);
    try {
      const foundDogs = await Dog.find({ owner: req.payload._id });
      res.json({ userId, foundDogs });
    } catch (e) {
      next(e);
    }
  });

  router.get('/user', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    try {
      const user = await User.findById(userId);
      res.json(user);
    } catch (e) {
      next(e);
    }
  });

  router.get('/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    try {
      const editUser = await User.findById(userId);
      console.log('test', editUser);
      res.json(userId, editUser);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.payload._id;
    const { email, name, location, age, image } = req.body;
    try {
      const editedUser = await User.findByIdAndUpdate(userId, { email, name, location, age, image }, { new: true });
      req.payload._id = editedUser;
      return res.json(editedUser);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = profileRoutes;
