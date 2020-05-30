const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const fs = require("fs");

const Cart = require("../models/cart");
const models = require("../database/models/index");

router.post("/reduce/:id", function (req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduseByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.post("/add-to-cart/:id", async function (req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  const product = await models.Product.findOne({
    raw: true,
    where: { id: productId },
  });
  cart.add(product, productId);
  console.log(product);
  req.session.cart = cart;
  //res.status(301).redirect("/");
  res.status(303).redirect("/");
});

router.get("/info/:id", async function (req, res, next) {
  const productId = req.params.id;
  const product = await models.Product.findOne({
    raw: true,
    where: { id: productId },
  });
  return res.render("shop/info", {
    ...res.locals,
    title: product.title,
    price: product.price,
    description: product.description,
    imgPath: product.imagePath,
    id: product.id,
  });
});

router.post("/remove/:id", function (req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.post("/sort/:sort", function (req, res, next) {
  const sort = req.params.sort;
  req.session.sort = sort;
  console.log(req.session.sort);
  res.redirect("/");
});

router.get("/shopping-cart", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", {
      title: "Shopping Cart",
      ...res.locals,
      products: [],
    });
  }
  const cart = new Cart(req.session.cart);
  return res.render("shop/shopping-cart", {
    title: "Shopping Cart",
    ...res.locals,
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const errMsq = req.flash("error")[0];
  const cart = new Cart(req.session.cart);
  res.render("shop/checkout", {
    title: "Checkout",
    ...res.locals,
    total: cart.totalPrice,
    errMsg: errMsq,
    noError: !errMsq,
  });
});

router.post("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }

  let cart = new Cart(req.session.cart);
  const stripe = require("stripe")(
    "sk_test_X3cuTu5C8NR10UPvN9Ghl4Gx00c1rwgmo6"
  );
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken,
      description: "Test",
    },
    async function (err, charge) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/checkout");
      }

      const [user] = await req.user;
      console.log(user);
      let order = await models.Order.create({
        user: user.id,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id,
      });

      if (order) {
        req.flash("success", "Successfully ");
        req.session.cart = null;
        res.redirect("/");
      }
    }
  );
});

router.get("/", async function (req, res, next) {
  const successMsg = req.flash("success")[0];

  if (req.session.sort) {
    const response = await models.Product.findAndCountAll({
      raw: true,
      order: [["price", req.session.sort]],
    });
    const products = response.rows;
    res.render("shop/index", {
      ...res.locals,
      title: "Shopping Cart",
      products: products,
      successMsg: successMsg,
      noMessages: !successMsg,
    });
  } else {
    const response = await models.Product.findAndCountAll({
      raw: true,
      order: [["title", "Asc"]],
    });
    const products = response.rows;
    res.render("shop/index", {
      ...res.locals,
      title: "Shopping Cart",
      products: products,
      successMsg: successMsg,
      noMessages: !successMsg,
    });
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}

module.exports = router;
