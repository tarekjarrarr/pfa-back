const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "de99b7e8c87a40",
      pass: "bac04b20df7f77"
    }
  });

exports.sendMail=async function(mailOptions){
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
            return next(err);
        }
        console.log("Info: ", info);
        res.json({
          message: "Email successfully sent."
        });
      });
}