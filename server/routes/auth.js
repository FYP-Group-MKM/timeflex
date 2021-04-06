const router = require('express').Router();
const passport = require('passport');

router.get('/login/success', (req, res) => {
    console.log('fetching user profile...')
    if (req.user) {
        console.log(req.user)
        res.json(req.user);
    } else {
        console.log('User not logged in yet')
        res.status(401).json({ message: 'USER_NOT_AUTHENTICATED' });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect',
    (req, res, next) => {
        console.log('redirecting user to TimeFlex...');
        next();
    },
    passport.authenticate('google', {
        successRedirect: `http://localhost:${process.env.PORT || 5000}`
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`http://localhost:${process.env.PORT || 5000}`);
});

module.exports = router;