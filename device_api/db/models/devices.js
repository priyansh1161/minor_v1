'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');

let Schema = mongoose.Schema;

let DeviceSchema = new Schema({
    number : {type : Number, required : true, unique : true}, //device number
    at : String, // device current location
    uniqueCode : String, //sha256 encrypted code
    salt : String, // salt used for encryption
});

DeviceSchema.methods.setUniqueCode = function () {
   let salt = crypto.randomBytes(16).toString('hex');
   let code = this.at || 'ultraSecretCodeWhenNoAt'; // get code form pre specified at or default
   crypto.pbkdf2(code,salt,1000,128,'sha256', (err, uniqueCode) => {
       if(err){
           throw new Error(err.message);
       }
       this.salt = salt;
       this.uniqueCode = uniqueCode.toString('hex');
   });
};

mongoose.model('Device',DeviceSchema);

module.exports = DeviceSchema;