module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.oldUrl = req.url;
    res.redirect("/auth/signin");
  },
  notLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
  setLocals: (req, res, next) => {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
  },

  notFound: (req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  },

  errorHandling: (err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  },
};
