const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');         //Special area of 'session' to store messages
const session = require('express-session');      //To handle user data beteween different requests


const app = express();  

//DB CONFIG
const db = require('./Config/key').MongoURI;

//Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BODYPARSER
app.use(express.urlencoded ({ extended : false}));      //We can now get data from our form from req.body


//EXPRESS SESSION MIDDLEWARE (From https://github.com/expressjs/session)
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));


//Connect FLASH (middleware)
app.use(flash());


//Global Vars for different colors for different messages
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


app.use('/', require('./Routes/index'));


app.use('/users', require('./Routes/Users'));


const PORT = process.env.PORT || 5000;      //WHERE 'APP' WILL RUN ON

app.listen(PORT, console.log(`Server started on port ${PORT}`));     //'LISTEN' runs a server needed for passing in PORT 
