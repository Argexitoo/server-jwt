const express = require('express');
const Dog = require('../models/Dog.model');
const User = require('../models/User.model');
const Meeting = require('../models/Meeting.model');

function meetingRoutes() {
  const router = express.Router();

  // VIEW MEETINGS USER
  router.get('/', async (req, res, next) => {
    const userId = req.session.currentUser._id;
    try {
      const allmeetings = await Meeting.find({});
      const myMeetings = await Meeting.find({ owner: userId });
      const joinedMeetings = allmeetings.filter(meeting => meeting.usersJoined.includes(userId));
      res.json(myMeetings, joinedMeetings);
      // res.render('./meeting/mymeetings', { myMeetings, joinedMeetings });
    } catch (e) {
      next(e);
    }
  });

  // ADD NEW MEETING
  router.post('/add', async (req, res, next) => {
    const userId = req.session.currentUser._id;
    const { name, location, date, hour, description } = req.body;
    try {
      if (!name || !location || !date || !hour || !description) {
        return res.json('/', {
          errorMessage: 'Complete all fields',
        });
      }
      const meeting = await Meeting.create({ name, location, date, hour, description, owner: userId });
      res.json(meeting);
    } catch (e) {
      next(e);
    }
  });

  // EDIT MEETING

  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const editMeeting = await Meeting.findById(id);
      res.json(id, editMeeting);
      // res.render('./meeting/update-form-meeting', { id, editMeeting });
    } catch (e) {
      next(e);
    }
  });

  router.post('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, location, date, hour, description } = req.body;
    try {
      const editMeeting = await Meeting.findByIdAndUpdate(id, { name, location, date, hour, description }, { new: true });
      return res.json(editMeeting);
    } catch (e) {
      next(e);
    }
  });

  // DELETE MEETING
  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleteMeeting = await Meeting.findByIdAndDelete(id);
      res.json(deleteMeeting);
    } catch (e) {
      next(e);
    }
  });
  // VIEW ALL MEETINGS
  router.get('/', async (req, res, next) => {
    const { id } = req.params;
    try {
      const foundMeetings = await Meeting.find();
      res.json(foundMeetings);
    } catch (e) {
      next(e);
    }
  });
  // VIEW MEETING ID
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const meeting = await Meeting.findById(id).populate('usersJoined').populate('owner');
      res.json(meeting);
    } catch (e) {
      next(e);
    }
  });
  // MEETING JOIN /// PREGUNTAR ALE REDIRECT , ROUTER.POST/get
  router.post('/:id', async (req, res, next) => {
    const user = req.session.currentUser;
    const { id } = req.params;
    try {
      const meeting = await Meeting.findById(id);
      if (!meeting.usersJoined.includes(user._id)) {
        meeting.usersJoined.push(user._id);
        meeting.save();
      }
      return res.redirect('/mymeetings');
    } catch (e) {
      next(e);
    }
  });

  // JOINED MEETINGS
  router.get('/joinedmeetings', async (req, res, next) => {
    const user = req.session.currentUser;
    try {
      const allmeetings = await Meeting.find({});
      const myMeetings = allmeetings.filter(meeting => meeting.usersJoined.includes(user._id));
      // mymeetings objecte que conté els meus meetings
      console.log(mymeetings);
      return res.json(myMeetings);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = meetingRoutes;