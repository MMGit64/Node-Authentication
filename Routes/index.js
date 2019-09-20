const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('Welcome'));       //render the message 'welcome' based on content in welcome.ejs
                                                            //and <%- body %> in layout.ejs

module.exports = router;