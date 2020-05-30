const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");

const Cart = require("../models/cart");
const models = require("../database/models/index");

const csrfProtection = new csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const [user] = await req.user;
  console.log(user);
  let orders = await models.Order.findAll({
    raw: true,
    where: { user: user.id },
  });
  let cart;
  orders.forEach(function (order) {
    cart = new Cart(order.cart);
    order.items = cart.generateArray();
  });
  res.render("user/profile", {
    ...res.locals,
    title: "Profile",
    orders: orders,
  });
});

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect("/");
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

router.get("/signup", function (req, res, next) {
  const messages = req.flash("error");
  console.log("csruf: " + req.csrfToken());
  res.render("user/signup", {
    ...res.locals,
    title: "SignUP",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

router.get("/signin", function (req, res, next) {
  const messages = req.flash("error");
  res.render("user/signin", {
    ...res.locals,
    title: "SignIN",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
