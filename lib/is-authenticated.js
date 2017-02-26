module.exports = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    username = req.user.username;
    loggedIn = true;
    next();
  } else {
    req.flash("error-msg", "* please log in first");
    res.redirect(303, '/gallery/login');
  }
};

