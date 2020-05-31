const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const validator = require("express-validator");

require("dotenv").config();
const db = require("./database/models/index");

const routes = require("./routes/index");

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

app.use(routes);

module.exports = app;
