const router = require('express').Router();
const passport = require('passport');
const portConifg = require('../config/portConfig');

router.get('/login/success', (req, res) => {
    console.log('fetching user profile...')
    if (req.user) {
        res.json(req.user);
    } else {
        console.log('User not logged in yet')
        res.status(401).json({ message: 'USER_NOT_AUTHENTICATED' });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect', (req, res, next) => {
    passport.authenticate('google', {
        // successRedirect: `https://timeflex-web.herokuapp.com`
        successRedirect: req.useragent.isMobile ? `exp://10.66.102.197:19000/${req.user.googleId}` : `http://localhost:${portConifg.AUTH_REDIRECT_PORT}`
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    // res.redirect(`https://timeflex-web.herokuapp.com`);
    res.redirect(`http://localhost:${portConifg.AUTH_REDIRECT_PORT}`);
});

module.exports = router;