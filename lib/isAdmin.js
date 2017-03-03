module.exports = function isAdmin(req, res, next) {
  console.log('---isAdmin TRIGGERED---');
  if ( req.user && req.user.username === 'admin' ) {
    return next();
  }
  req.flash('error-msg', 'must log in as admin for access');
  return res.redirect('/gallery/login');
};