const router = require('express').Router();
const passport = require('passport');

// auth with google+
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
// router.get('/google',
//     (req, res, next) => {
//         console.log('redirecting to Google authentication...');
//         next();
//     },
//     passport.authenticate('google', { scope: ['profile'] })
// );

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect',
    passport.authenticate('google', { successRedirect: "http://localhost:3000" }),
    () => console.log('redirected from Google login page!')
);

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;