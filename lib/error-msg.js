module.exports = function errorMsg(req, res, err) {
  console.log('---errorMsg---');
  for (let i = 0; i < err.errors.length; i++) {
    req.flash("error-msg", err.errors[i].message);
  }
};
