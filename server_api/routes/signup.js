const express = require('express');
const router = express.Router();

router.get('/',function (req,res) {
   res.sendFile('/views/signup.html',{root: '.'});
});

module.exports = router;