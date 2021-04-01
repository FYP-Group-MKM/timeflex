const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require("cookie-session");
const passportSetup = require('./config/passport-setup');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const keys = require('./config/keys');

const app = express();
const PORT = 5000;

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
