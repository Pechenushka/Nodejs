const express = require("express");
const router = express.Router();
const Cart = require("./../../models/cart");
const models = require("./../../database/models/index");

const { isLoggedIn } = require("./../midleware");

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
  res.status(303).redirect("/");
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

  res.redirect("/");
});

router.post("/search", function (req, res, next) {
  const search = req.body.search;
  req.session.search = search;
  console.log(search);
  res.redirect("/");
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

module.exports = router;
