const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieSession = require("cookie-session");
const appointments = require('./routes' + '/appointments');
const auth = require('./routes/auth');
const PORT = process.env.PORT || 5000;
// const keys = require('./config/keys');
let MONGODB_URL, COOKIE_KEY;
const portConifg = require('./config/portConfig');
require('./config/passportSetup');

const app = express();

if (process.env.MONGODB_URL) {
    MONGODB_URL = process.env.MONGODB_URL;
    COOKIE_KEY = process.env.MONGODB_URL;
}
else {
    const keys = require('./config/keys');
    MONGODB_URL = keys.mongodb.dbURI;
    COOKIE_KEY = keys.session.cookieKey;
}


mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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
    keys: [COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

const authCheck = (req, res, next) => {
    if (!req.user) res.status(401).json({ message: "ACCESS_DENIED" })
    else next();
}

app.use('/auth', auth);
app.use('/appointments', authCheck, appointments);

if (portConifg.AUTH_REDIRECT_PORT === 5000) {
    app.use(express.static(path.resolve('client/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve('client/build/index.html')));
}