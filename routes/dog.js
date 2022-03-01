const express = require('express');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const Dog = require('../models/Dog.model');

// const User = require('../models/user');
// const Meeting = require('../models/meeting');
// const isLoggedIn = require('../middlewares');

function dogRoutes() {
  const router = express.Router();

  // VIEW MY DOGS
  router.get('/', async (req, res, next) => {
    const userId = req.session.currentUser._id;
    try {
      const foundDogs = await Dog.find({ owner: userId });
      res.json(foundDogs);
    } catch (e) {
      next(e);
    }
  });

  // ADD NEW DOG
  router.post('/add', isAuthenticated, async (req, res, next) => {
    console.log('Entering');
    const userId = res.locals.user._id;
    console.log(res.locals.user);
    const { name, sex, race, size, age, image } = req.body;
    try {
      if (!name || !sex || !race || !size || !age) {
        return res.json({
          errorMessage: 'Complete all fields',
        });
      }
      const newDog = await Dog.create({ name, sex, race, size, age, image, owner: userId });
      res.json({ created: newDog });
    } catch (e) {
      next(e);
    }
  });

  // EDIT DOG
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const editDog = await Dog.findById(id);
      res.json(id, editDog);
      // res.render('./dog/update-form', { id, editDog });
    } catch (e) {
      next(e);
    }
  });

  router.post('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, sex, race, size, age, image } = req.body;
    try {
      const editDog = await Dog.findByIdAndUpdate(id, { name, sex, race, size, age, image }, { new: true });
      return res.json(editDog);
    } catch (e) {
      next(e);
    }
  });

  // DELETE DOG
  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleteDog = await Dog.findByIdAndDelete(id);
      res.json(deleteDog);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = dogRoutes;