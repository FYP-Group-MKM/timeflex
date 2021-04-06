const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieSession = require("cookie-session");
const appointments = require('./routes' + '/appointments');
const auth = require('./routes/auth');
const keys = require('./config/keys');
const PORT = process.env.PORT || 5000;
require('./config/passportSetup');

const app = express();

mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // allow session cookie from browser to pass through
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

const authCheck = (req, res, next) => {
    if (!req.user) res.status(401).json({ message: "ACCESS_DENIED" })
    else next();
}

app.use('/auth', auth);
app.use('' + '/appointments', authCheck, appointments);

app.use(express.static('../client/build'));

app.get('*', function (req, res) {
    res.sendFile(path.join('../client/build/index.html'));
});