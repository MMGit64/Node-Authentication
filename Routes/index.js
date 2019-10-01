const express = require('express');
const router = express.Router();
const {ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('Welcome'));       //render the message 'welcome' based on content in welcome.ejs
                                                            //and <%- body %> in layout.ejs

router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    }));                                                           

module.exports = router;