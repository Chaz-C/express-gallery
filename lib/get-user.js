module.exports = function getUser(req, res) {
  if ( req.user ) {
    return {
      loggedIn : true,
      username : req.user.username
    };
  } else {
    return {
      loggedIn : false,
      username : null
    };
  }
};