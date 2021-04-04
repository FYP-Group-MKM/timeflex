const router = require('express').Router();
const passport = require('passport');

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.json({});
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect', passport.authenticate('google', {
    successRedirect: "http://localhost:3000/calendar"
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000');
});

module.exports = router;