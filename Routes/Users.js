const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model:
const User = require('../Models/User');

//Login Page:
router.get('/login', (req, res) => res.render('Login'));

//Register Page:
router.get('/register', (req, res) => res.render('Register'));


//Register Handle:
router.post('/register', (req,res) => {
    const{ name, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields. ' });
    }

    //Check passwords match
    if(password !== password2){
        errors.push({ msg: "Passwords do not match. "});
    }

    //Check password length
    if (password.length < 6){
        errors.push({msg: "Password should be atleast 6 characters. "});
    }

    if (errors.length > 0) {
        res.render('register', {            //Passing the variables
            errors,                         //To show the errors 
            name,                           //As redirected back to register page
            email,
            password,
            password2
        });
    }
    else {
        //Validate the Pass:
        User.findOne({ email: email})   //Mongoose method to find a user record, returns a promise
        .then(user => {                 //Checks for availability of this user
           if (user){                   //If user already exists --> error
                //User Exists
                errors.push({ msg: "Email is already registered"})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
           } else {                         //If no user, a new one will be created through registration
               const newUser = new User({
                   name,
                   email,
                   password
               });

               //Hash Password
               bcrypt.genSalt(10, (err, salt) =>        //salt is the randomised string of characters to hash password
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                   if(err) throw err;

                   newUser.password = hash;     //Set the new password to be hashed
                   newUser.save()               //Save User and will get a promise
                   .then(user => {
                       req.flash('success_msg', 'You are now registered and can log in.');
                       res.redirect('/users/login');
                   })
                   .catch(err => console.log(err));
                }))
           }
        });
    }
});

//Login Handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


//LogOut handle

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;