const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        //Validate the Pass:
        User.findOne({ email: email})   //Returns a promise
        .then(user => {                 //Check for this user
           if (user){
                //User Exists
                errors.push({ msg: "Email is already registered"})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
           } else {
               const newUser = new User({
                   name,
                   email,
                   password
               });

               //Hash Password
               bcrypt.genSalt(10, (err, salt) => 
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


module.exports = router;