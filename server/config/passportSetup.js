const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User');
// const keys = require('./keys');
let GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET;

if (process.env.GOOGLE_CLIENT_ID) {
    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
} else {
    const keys = require('./keys');
    GOOGLE_CLIENT_ID = keys.google.clientID;
    GOOGLE_CLIENT_SECRET = keys.google.clientSecret;
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use('google', new GoogleStrategy({
    // options for google strategy
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
            done(null, currentUser);
        } else {
            console.log('creating new user in mongodb...');
            new User({
                googleId: profile.id,
                username: profile.displayName
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
})
);

passport.use('expo', new GoogleStrategy({
    // options for google strategy
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/expo-auth/google/redirect',
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
            done(null, currentUser);
        } else {
            console.log('creating new user in mongodb...');
            new User({
                googleId: profile.id,
                username: profile.displayName
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
})
);