const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport('smtps://a7m2repu%40gmail.com:74q7hh2yy7@smtp.gmail.com');

// setup e-mail data with unicode symbols


exports.sendMail = function(_to, _sub, _data) {
  return new Promise(function(resolve, reject) {
    const mailOptions = {
      from: '<a7m2repu@gmail.com>', // sender address
      to: _to, // list of receivers
      subject: _sub, // Subject line
      text: _data // plaintext body
      //html: '<b>Hello world 🐴</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return reject(error);
      }
      resolve('Message sent: ' + info.response);
    });

  });
}
