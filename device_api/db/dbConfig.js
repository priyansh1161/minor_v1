'use strict';
const mongoose = require('mongoose');
const config = require('../../config.js');

const DB_URL = process.env.NODE_ENV === 'production' ? config.PRODUCTION_DB_URL : config.DEV_DB_URL;

mongoose.connect(DB_URL, (err) => {
   if(err)
       console.log(`Failed to connect to ${DB_URL} due to `,err);
    else
        console.log(`Connected to ${DB_URL}`);
});
mongoose.connection.on('disconnect', () => {
    console.log(`Disconnected from ${DB_URL}`);
});

var gracefulShutdown = (msg, cb) => {
    console.log(`Disconnecting from Db at ${DB_URL} due to ${msg}`);
    cb();
};
// handle signals
//nodemon termination
process.once('SIGUSR2', () =>{
    gracefulShutdown('Exiting due to SIGUSR2', () => {
       // kill current process and throw a SIGUSR2 signal again
        process.kill(process.pid, 'SIGUSR2');
    });
});
// termination due to ctrl+c
process.on('SIGINT', () => {
    gracefulShutdown('Exiting due to SIGINT', () => {
       process.exit(0);
    });
});
//heroku termination/ restart
process.on('SIGTERM', () => {
    gracefulShutdown('Exiting due to SIGTERM', () => {
        process.exit(0);
    });
});

require('./models/devices');
require('./models/user');