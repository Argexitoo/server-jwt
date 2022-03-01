const express = require('express');
const Dog = require('../models/Dog.model');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

function profileRoutes() {
  const router = express.Router();

  router.get('/', isAuthenticated, async (req, res, next) => {
    const user = req.locals.user;
    try {
      const foundDogs = await Dog.find({ owner: user._id });
      res.json(user, foundDogs);
    } catch (e) {
      next(e);
    }
  });

  router.get('/edit', async (req, res, next) => {
    const user = req.session.currentUser._id;
    try {
      const editUser = await User.findById(user);
      res.json(user, editUser);
    } catch (e) {
      next(e);
    }
  });

  router.post('/edit', async (req, res, next) => {
    const userId = req.session.currentUser._id;
    const { email, nickname, name, location, age } = req.body;
    try {
      const editedUser = await User.findByIdAndUpdate(userId, { email, nickname, name, location, age }, { new: true });
      req.session.currentUser = editedUser;
      return;
      // return res.redirect('/profile');
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = profileRoutes;
