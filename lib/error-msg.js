module.exports = function errorMsg(req, res, err) {
  for (let i = 0; i < err.errors.length; i++) {
    req.flash("error-msg", err.errors[i].message);
  }
};
