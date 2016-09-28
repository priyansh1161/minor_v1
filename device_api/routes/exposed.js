'use strict';
const express = require('express');
const db = require('../db/db.js');
const mailService = require('../../utils/mail-service');
let router = express.Router();

let sendJsonResponse = (res, obj = {}) => {
    res.status(200);
    res.json(obj);
};

router.post('/', (req, res) => {
    // This is the Function for getting the data from device and populating data to dB and then to
    // user.
    db.registerViolation(req.body)
        .then((data) => {
            // find criminal aka by and send him a email notifying details.
            mailService(data.email, data.violations[data.violations.length -1]);
            console.log(`Sent: ${data}`);
            sendJsonResponse(res, {data})
        })
        .catch((err) => {
            // if registration fails
            console.log(`failed: ${err}`);
            sendJsonResponse(res, err);
        })
});

module.exports = router;