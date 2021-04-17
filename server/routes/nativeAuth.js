const router = require('express').Router();
const passport = require('passport');
const config = require('../../config');
const AUTH_REDIRECT = config.AUTH_REDIRECT;

router.get('/login/success', (req, res) => {
    console.log('fetching user profile...')
    if (req.user) {
        res.json(req.user);
    } else {
        console.log('User not logged in yet')
        res.status(401).json({ message: 'USER_NOT_AUTHENTICATED' });
    }
});

router.get('/google', passport.authenticate('mobile', { scope: ['profile'] }));

router.get('/google/redirect', (req, res, next) => {
    const userProfile = encodeURIComponent(JSON.stringify(req.user))
    passport.authenticate('mobile', {
        successRedirect: `timeflex://${userProfile}`
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(AUTH_REDIRECT);
});

module.exports = router;