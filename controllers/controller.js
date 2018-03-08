const express = require('express')

const router = express.Router()

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

router.get('/login', (err, res) => {
    res.render("login");
})

module.exports = router