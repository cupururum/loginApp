var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
const db = require('../models')


passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('inside of LocalStr')
        
        db.User.findOne({ where: { username: username }}, function (err, user) {
            console.log("i'm trying to find one")

            if (err) throw err
            if (!user) { return done(null, false, {message: 'Unknown User'}) }
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

module.exports = passport