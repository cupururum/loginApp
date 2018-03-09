const express = require('express')
const passport = require('passport')
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

router.get('/', (err, res) => {
        res.render("index");
})
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

  passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('inside of LocalStr')
        
        db.User.findOne({ where: { username: username }}, function (err, user) {
            console.log("i'm trying to find one")

            if (err) throw err
            if (!user) { return done(null, false, {message: 'Unknown User'}) }
            //console.log(user)
            


            // schema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
            //     let password = this.password;
            //     return new Promise((resolve, reject) => {
            //         bcrypt.compare(password, user.password, (err, success) => {
            //             if (err) return reject(err);
                        // return resolve(success);
       })
       .then(user => {
            console.log("promise with user")
            console.log(password)
            console.log(user.password)
            if (user) {
                bcrypt.compare(password, user.password).then(function(res) {
                    console.log(res)
                    if (res) {
                        done(null, user)
                    } else {
                        done(null, false, {message: 'Invalid password'})
                    }
                })
            }
       })
    })
)

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    console.log(id)
    db.User.findById(id).then((user) =>{
        console.log('user find by id ', user)
        if (user) {
 
            done(null, user.get());
 
        } else {
 
            done(user.errors, null);
 
        }
    });
});

router.post('/login', 
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true}),
  
  function(req, res) {
    console.log('passport auth')
    res.redirect('/');
  });

module.exports = router