var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');


passport.use(new LocalStrategy(
    function(db, username, password, done) {
        db.User.findOne({ where: { username: username }}, function (err, user) {
            if (err) throw err
            if (!user) { return done(null, false, {message: 'Unknown User'}) }
            
        })
        .then(user => {
                return bcrypt.compare(password, user.password, hash)
        })
        .then(isMatch => {
                    if(isMatch){
                        return done(null, user)
                    } else {
                        return done(null, false, {message: 'Invalid password'})
                    }
                })
        .catch(err => {if (err) console.log(err)});
       
      })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    db.User.findById({ where: { id: id }}, function (err, user) {
        done(err, user);
    });
});


