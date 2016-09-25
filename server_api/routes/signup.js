const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const router = express.Router();
// todo make SECRET_KEY env variable
const SECRET_KEY = '6LdlnAcUAAAAAFI2FHjsCGbv1G9G_5QHVY2LUJyl';
const reCaptcha_PREFIX = 'https://www.google.com/recaptcha/api/siteverify?secret=';
let User = mongoose.model('User');
function sendJSON(res, status, data = {}) {
    res.status(status);
    res.json(data);
}
var saveToDB = (req, res, body) => {
    console.log(body);
    let newUser = new User({
        name : `${body.first_name} ${body.last_name}`,
        address : `${body.address}, ${body.city} ${body.pin_code}`,
        email : body.email,
        carId : body.ID
    });
    newUser.setPassword(body.password)
        .then((data) =>{
            console.log(data);
            console.log(newUser,'user');
           return newUser.save()
        })
        .then((data) => {
            console.log(data,'final');
            sendJSON(res, 200, { msg : 'done' });
        })
        .catch((reason) => {
           console.log(reason,'xhr');
            // todo send formatted error
           sendJSON(res, 500, {errmsg : reason.message});
        });


};
router.get('/', (req,res) => {
   res.sendFile('/views/signup.html',{root: '.'});
});
router.post('/', (req,res) => {
    // google reCaptcha validation
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return sendJSON(res, 401, {"msg" : "Please select captcha"});
    }
    let verificationUrl = `${reCaptcha_PREFIX}${SECRET_KEY}&response=${req.body['g-recaptcha-response']}&remoteip="${req.connection.remoteAddress}`;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl,(error,response,body) => {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
            return sendJSON(res, 401,{msg : "Failed captcha verification"});
        }
        saveToDB(req, res, req.body);

    });
});
module.exports = router;