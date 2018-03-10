const express = require('express')
const passport = require('./passport')
var LocalStrategy = require('passport-local').Strategy;
const router = express.Router()
var bcrypt = require('bcrypt');

const db = require('../models')
//


class UserConstructor {
    constructor(username, password) {
        this.username = username,
        this.password = password
    }
  }

router.get('/', ensureAuthenticate, (err, res) => {
        res.render("index");
})

function ensureAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('error', 'You are not ligged in')
        res.redirect('/login')
    }
}
router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/register', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var conf_password = req.body.conf_password

    // Validation
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('conf_password', 'Passwords do not match').equals(req.body.password)

    var errors = req.validationErrors()
    console.log('34 ', errors)

    if(errors) {
        res.render('register', {
            errors: errors
        })
    } else {
       var newUser = new UserConstructor(username, password)
        db.User.create(newUser, (err, user)=>{
                if(err) throw err
                console.log('47 ', user)        
            })
        req.flash('success_msg', 'You are registered and can now login')
        res.redirect('/login')
    }
})

router.post('/login', 
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true}),
  
  function(req, res) {
    console.log('passport auth')
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
    req.logout()

    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
   
})

module.exports = router