const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieSession = require("cookie-session");
const useragent = require('express-useragent');
require('./config/passportSetup');

const appointments = require('./routes/appointments');
const webAuth = require('./routes/auth');
const expoAuth = require('./routes/expoAuth');
const nativeAuth = require('./routes/nativeAuth');
const config = require('../config');

const PORT = process.env.PORT || 5000;

const app = express();

let MONGODB_URL, COOKIE_KEY;
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
        origin: 'http://localhost:3000', // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // allow session cookie from browser to pass through
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(useragent.express());

app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', webAuth);
app.use('/expo-auth', expoAuth);
app.use('/native-auth', nativeAuth);

const authCheck = (req, res, next) => {
    if (req.user) next();
    else if (req.useragent.browser === 'Expo') next();
    else if (req.useragent.browser === 'TimeFlex') next();
    else res.status(401).json({ message: "ACCESS_DENIED" });
};

app.use('/appointments', authCheck, appointments);


if (config.AUTH_REDIRECT !== 'http://localhost:3000') {
    app.use(express.static(path.resolve('client/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve('client/build/index.html')));
}