const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const sequelize = require('sequelize')
const routes = require("./controllers/controller.js");
const db = require("./models");
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')

const PORT = process.env.PORT || 3035;

const app = express();

// view engine

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator())
app.use(cookieParser())


app.use(express.static(__dirname + "/public"));

// Express session
app.use(session({
  secret: 'enigmaticcatlikestunaandchicken',
  saveUninitialized: true,
  resave: true
}))

//passport init
app.use(passport.initialize());
app.use(passport.session());

// connect Flash
app.use(flash())

// Globar vars
app.use(function(req,res, next){
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})


app.use(routes)

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });
