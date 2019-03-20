module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  },
  ensureGuest: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.user);
      res.redirect("/cars");
    } else {
      return next();
    }
  }
};
