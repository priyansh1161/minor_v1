
const DOMAIN = 'sandboxb3607db403f448ab8cbae0fddbdff757.mailgun.org';
const API_KEY = 'key-1307649cbbd615132f4d1496c568de1f';

const mailgun = require('mailgun-js')({apiKey : API_KEY, domain : DOMAIN });

let sendViolationMail = (to, {at, registeredOn, type, fine}) => {
    let html = `Hello ${to},
this is to inform you that You have Violated the law by Jumping Red light at ${at} on ${registeredOn}.
due to which You are charged ${fine} as fine which is due and Should be payed before 12 days of receiving this mail.
<p style="font-size: 10px">This is a auto generated mail and should not be replied to.</p>`;
    let data = {
        from : 'Traffic Police <priyansh@sandboxb3607db403f448ab8cbae0fddbdff757.mailgun.org>',
        to : 'priyanshgupta1161@gmail.com',
        subject : 'Red light jump Fine',
        html
    };
    console.log(data);
    mailgun.messages().send(data, function (error, body) {
        console.log(body);
        console.log(error);
    });
};

module.exports = sendViolationMail;

