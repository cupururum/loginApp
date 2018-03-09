//const sequilize = require('sequilize')

var bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = (sequelize, DataTypes) => {

  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });

  // Method 3 via the direct method
  User.beforeCreate((newUser, callback) => {
    console.log("password newUser", newUser.password)
    return bcrypt.hash(newUser.password, saltRounds)
    .then((hash) => {
      newUser.password = hash
    }).catch(err => {
      if (err) console.log(err);
    });
  })



  return User
}

