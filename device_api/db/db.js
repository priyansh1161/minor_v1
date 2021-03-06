'use strict';
const mongoose = require('mongoose');
const Device = mongoose.model('Device');
const User = mongoose.model('User');
let db = {};
// uniqueCode is _id
db.registerViolation = ({crime, uniqueCode, by, time}, ...rest) => {
    return new Promise((resolve, reject) => {
        var register = (data) => {
            if (!data)
                return Promise.reject('Wrong Device Key');
            return new Promise((resolve, reject) => {
                let registerUtil = (user) => {
                    if(!user)
                       return reject('Wrong User key');
                    user.violations.push({
                        on : time,
                        type : crime
                    });
                    user.save((err, updated) => {
                        if(err)
                            reject(err.message);
                        else {
                            // console.log(updated);
                            resolve(updated);
                        }
                    });
                };
                User
                    .findOne({carId : by})
                    .exec()
                    .then(registerUtil)
                    .catch(errorHandler);
            });
        };
        var errorHandler = (reason) => {
            console.log(reason,'err handler');
            return reject(reason);
        };
        // find if uniqueCode is correct
        Device
            .findById(uniqueCode)
            .exec()
            .then(register)
            .then(data => resolve(data))
            .catch(errorHandler);

    });
};

module.exports = db;