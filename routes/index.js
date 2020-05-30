var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/Product');
var Order = require('../models/order');

/* GET home page. */


router.post('/add-to-cart/:id', function (req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{});
  Product.findById(productId, function (err, product) {
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});




router.get('/info/:id', function (req,res,next) {
  var productId = req.params.id;

  Product.findById(productId, function (err, product) {
    if(err){
      return res.redirect('/');
    }
    return res.render('shop/info' ,{title: product.title, price: product.price, description:product.description, imgPath:product.imagePath, _id:product._id });
  });
});

router.get('/reduce/:id', function (req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{});
  cart.reduseByOne(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{});
  cart.removeItem(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req,res, next) {
  if(!req.session.cart){
    return res.render('shop/shopping-cart' ,{products:null});
  }
  var cart = new Cart(req.session.cart);
  return res.render('shop/shopping-cart' ,{products:cart.generateArray(), totalPrice: cart.totalPrice});
});


router. get('/checkout', isLoggedIn,  function (req, res, next) {
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var errMsq = req.flash('error')[0];
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsq, noError:!errMsq});
});


 router.post('/checkout', isLoggedIn, function (req,res, next) {

   if(!req.session.cart){
     return res.redirect('/shopping-cart');
   }

   var cart = new Cart(req.session.cart);
   const stripe = require('stripe')('sk_test_X3cuTu5C8NR10UPvN9Ghl4Gx00c1rwgmo6');
   stripe.charges.create({
            amount:cart.totalPrice *100,
            currency:'usd',
            source: req.body.stripeToken,
            description:"Test"

       },function (err,charge) {
            if(err){
              req.flash('error',err.message);
              return res.redirect('/checkout');
            }
            var order = new Order({
              user: req.user,
              cart: cart,
              address: req.body.address,
              name: req.body.name,
              paymentId: charge.id
            });
            order.save(function (err, result) {

              req.flash('success','Successfully ');
              req.session.cart = null;
              res.redirect('/');
            });
     });
 });
router.get('/', function(req, res, next) {

  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {

    res.render('shop/index', { title: 'Shopping Cart', products: docs, successMsg: successMsg, noMessages: !successMsg});
  });


});
function isLoggedIn(req, res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl= req.url;
  res.redirect('/user/signin');
}

module.exports = router;
