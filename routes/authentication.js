const express = require('express');
const router  = express.Router();
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

//login
//get login information from the user
router.get('/login',ensureLoggedOut() ,(req,res) => {
  res.render('authentication/login');
});

//planit post information back to the user once it has verified that it exists
router.post('/login',ensureLoggedOut() , passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

//fb auth routes
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

//logout
router.post('/logout',ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});


//signup data exchange starts
//get the new username and password
router.get('/signup', ensureLoggedOut()  , (req, res) => {
    res.render('authentication/signup');
});
// post to the user a success or error
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));



module.exports = router;
