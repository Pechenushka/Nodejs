const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
//const expressHbs = require('express-handlebars');
//const ejs = require('ejs');

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const validator = require("express-validator");

require("dotenv").config();
const db = require("./database/models/index");

const routes = require("./routes/index");
const userRoutes = require("./routes/user");

// const Handlebars = require('handlebars');
//
// const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
console.log(path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

const connection = db.sequelize;
connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

require("./config/passport");

// view engine setup
// app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
// app.set('view engine', '.hbs');

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.use(
  session({
    key: "user_sid",
    secret: "victoriasecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      //secure: true,
      sameSite: true,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use("/user", userRoutes);
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;
