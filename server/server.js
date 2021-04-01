const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require("cookie-session");
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');
const keys = require('./config/keys');
const passportSetup = require('./config/passportSetup');
const PORT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/appointments', appointments);
app.use('./auth', auth);

mongoose.connect(keys.mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

