require('dotenv/config');
require('./db');
const express = require('express');

const { isAuthenticated } = require('./middleware/jwt.middleware');
const allRoutes = require('./routes');
const authRouter = require('./routes/auth.routes');
const protectedRoute = require('./routes/protected.routes');
const dogRoutes = require('./routes/dog');
const profileRoutes = require('./routes/profile');
const meetingRoutes = require('./routes/meeting');

const app = express();

require('./config')(app);

// app.use('/api', allRoutes);
// app.use('/api/protected', isAuthenticated, protectedRoute);
app.use('/auth', authRouter);
app.use('/dog', protectedRoute, dogRoutes());
app.use('/profile', protectedRoute, profileRoutes());
app.use('/meetings', meetingRoutes());

require('./error-handling')(app);

module.exports = app;
