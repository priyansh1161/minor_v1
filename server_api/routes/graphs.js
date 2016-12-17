'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
let User = mongoose.model('User');

Date.prototype.getDateKey = function() {
    function two(n) {
        return (n < 10 ? '0' : '') + n;
    }

    return two(this.getDate()) + '/' + two(this.getMonth() + 1) + '/' + this.getFullYear();
};

router.post('/',(req, res) => {
    if(req.body.start && req.body.end) {
        let handler = function (data) {
            console.log(data,req.body);
            let date_map = {};
            data.forEach((curr) => {
                curr.violations.forEach((value) => {
                    var reg = new Date(value.registeredOn);
                    let registeredOn = reg.getDateKey();
                    console.log(value,registeredOn);
                    if(!date_map[registeredOn])
                        date_map[registeredOn] = 1;
                    else
                        date_map[registeredOn]++;
                });
            });
            res.json(date_map);
        };
        User
            .find({
                'violations.registeredOn'  : { $gt : req.body.start , $lt : req.body.end  }
            })
            .select('name violations.registeredOn email carId')
            .exec()
            .then(handler)
            .catch((reason) => {
                console.log(reason);
        });
    }

});
router.post('/current', (req, res) => {
    let handler = (data) => {
        console.log(data);
        res.send(data);
    };
    User
        .find({
            'violations.isDue' : true
        })
        .select('-salt -hash')
        .exec()
        .then(handler)
        .catch((reason) =>{
            console.log(reason);
        })
});
router.post('/paid', (req, res) => {
    let handler = (data) => {
        console.log(data);
        res.send(data);
    };
    User
        .find({
            'violations.isDue': false
        })
        .select('-violations -salt -hash')
        .exec()
        .then(handler)
        .catch((reason) => {
            console.log(reason);
        })
});
router.post('/summery', (req, res) => {
    let handler = (data) => {
        let day_map = {};
        let time_map = {};
        let mostTrafficDay = {
          count : 0,
          day : 0, //monday
        };
        let mostTrafficTime = {
            count : 0,
            time : 0 // 00 hrs
        };
        data.forEach((curr) => {
            for(let i=0;i<curr.violations.length;i++) {
                let date = new Date(curr.violations[i].registeredOn);
                console.log(date.getDay(),'day');
                if (day_map[date.getDay()])
                    day_map[date.getDay()]++;
                else
                    day_map[date.getDay()] = 1;
                if (time_map[date.getHours()])
                    time_map[date.getHours()]++;
                else
                    day_map[date.getHours()] = 1;
                console.log('date ', day_map[date.getDay()]);
                console.log('time ', time_map[date.getHours()]);
            }
        });
        // find max in day_map and time_map
        console.log(day_map,'it i day map');
        for (let key in day_map){
            if(mostTrafficDay.count < day_map[key]){
                mostTrafficDay.count = day_map[key];
                mostTrafficDay.day = key;
            }
        }
        for(let key in time_map){
            if(mostTrafficTime.count < time_map[key]){
                mostTrafficTime.count = time_map[key];
                mostTrafficTime.time = key;
            }
        }
        console.log(mostTrafficDay,mostTrafficTime);
        res.send({
           mostTrafficDay,
           mostTrafficTime,
           day_map
        });
    };
    User
        .find({
            'violations.isDue' : true
        })
        .select('violations.registeredOn')
        .exec()
        .then(handler)
        .catch((reason) => {
           console.log(reason);
           res.json(reason);
        });
});
module.exports = router;

// http://api.textlocal.in/send/?username=priyanshgupta1161@gmail.com&hash=6d58ded3af8275d9303b1b0396a99158fabe80b8&sender=TXTLCL&numbers=919690918100&message=Test_message
