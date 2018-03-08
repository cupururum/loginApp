//const sequilize = require('sequilize')

var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

module.exports = (sequelize, DataTypes) => {

  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });

  // Method 3 via the direct method
  User.beforeCreate((newUser, callback) => {
    return bcrypt.hash(myPlaintextPassword, saltRounds)
    .then((hash) => {
      newUser.password = hash
    }).catch(err => {
      if (err) console.log(err);
    });
  })

  return User
}

