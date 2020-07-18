const nodemailer = require('nodemailer');
const config = require('config');

class NotificationService{

    sendEmail(recipient,userId){
        const transporter = nodemailer.createTransport({
            service: config.get('smtphost'),//'gmail',
            auth: {
              user: config.get('smtpusername'),
              pass: config.get('smtppassword')
            }
          });

          const mailOptions = {
            from: 'reoacumen@gmail.com',
            to: recipient,
            subject: 'Account Registration',
            text: `your account has been created on student portal, use UserId -> ${userId} and Email ->  ${recipient} to verify your account`
          };
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
}

module.exports = NotificationService;