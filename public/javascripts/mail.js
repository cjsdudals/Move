var ejs = require('ejs');
var nodemailer = require('nodemailer');
var path = require('path');
var appDir = __dirname;
require('dotenv').config();

async function sendMail(req, res, next){
    var authNum = Math.random().toString().substr(2, 6);
    var emailTemplete;
    ejs.renderFile(appDir+'/authMail.ejs', {authCode: authNum}, function(err, data){
      if(err){console.log(err)}
      emailTemplete = data;
    })
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth:{
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  
    var mailOption = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: req.body.email,
      subject: `회원가입을 위한 인증번호를 입력해주세요`,
      html: emailTemplete,
    });
  
    transporter.sendMail(mailOption, function(error, info){
      if(error){
        console.log(error);
      }
      console.log('Finish sending email : ' + info.response);
  
      transporter.close();
    });
}