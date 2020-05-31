const express = require("express");
const router = express.Router();

const Cart = require("./../../models/cart");
const models = require("./../../database/models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { isLoggedIn } = require("./../midleware");

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

router.get("/", async function (req, res, next) {
  const successMsg = req.flash("success")[0];

  if (req.session.sort) {
    const response = await models.Product.findAndCountAll({
      raw: true,
      order: [["price", req.session.sort]],
      where: {
        title: {
          [Op.like]: req.session.search ? "%" + req.session.search + "%" : "%",
        },
      },
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
      where: {
        title: {
          [Op.like]: req.session.search ? "%" + req.session.search + "%" : "%",
        },
      },
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

module.exports = router;
