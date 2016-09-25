'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');
let Schema = mongoose.Schema;

let ViolationSchema = new Schema({
    type : {type : String, default : 'Red light jump'},
    registeredOn : {type : Date, default: Date.now},
    fine : {type : Number, default : 500},
    isDue : {type : Boolean, default : true}
});

let UserSchema = new Schema({
   name : {type : String, required : true},
   address : {type : String, required : true},
   phone : {type : Number, max : 10, min : 10},
   email : {type : String, required : true, unique : true},
   hash : String,
   salt : String,
   violations : [ViolationSchema],
   carId : {type : String, unique : true}
});

UserSchema.methods.setPassword = function (passKey) {
  let salt = crypto.randomBytes(16).toString('hex');
    console.log(passKey);
    return new Promise( (resolve, reject) => {
        crypto.pbkdf2(passKey, salt, 1000, 256, 'sha256', (err, hash) => {
            if (err)
                reject('Can not set password');
            else {
                this.hash = hash.toString('hex');
                this.salt = salt;
                resolve(this);
            }
        });
    });

};
UserSchema.methods.ValidatePassword = function (passkey) {
    return new Promise( (resolve, reject) => {
        crypto.pbkdf2(passkey, this.salt, 1000, 256, 'sha256', (err, hash) => {
            if (err)
                reject(err.message);
            else {
                if(this.hash === hash.toString('hex'))
                    resolve();
                else
                    reject('Wrong Password');
            }
        });
    });
};

mongoose.model('User', UserSchema);
module.exports = UserSchema;