'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');

let Schema = mongoose.Schema;

let DeviceSchema = new Schema({
    number : {type : Number, required : true, unique : true}, //device number
    at : String, // device current location
});

mongoose.model('Device',DeviceSchema);

module.exports = DeviceSchema;