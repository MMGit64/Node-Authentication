//Passport is important for login

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');     //To check passwords match

//Bring in User model

const User = require('../Models/User');

//export the strategy created above
//instead of importing passport above, pass it in from app.js file
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Check user with this email
            User.findOne({ email: email})
            .then( user => {
                if (!user) {                //'null' represents error, 'false' represents user
                    return done(null, false, {message: 'That email is not registered'})
                }
                //Check password is correct --> boolean statement; either error or match
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user); //user instead of false means that there is a match
                    }
                    else{
                        return done(null, false, {message: 'Password is incorrect'});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );


    //Serialization and deserialisation of user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
}