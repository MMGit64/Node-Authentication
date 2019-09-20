const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Create the model
const User = mongoose.model('User', UserSchema) //passing our model name ' user' and schema 'schema

module.exports = User;  //exporting means that we can use 'User model' in other files