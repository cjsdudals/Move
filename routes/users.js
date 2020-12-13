var express = require('express');
var router = express.Router();
var check = require('../models/check');
var connection = require('../models/db');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var path = require('path');
var appDir = __dirname;
require('dotenv').config();
const { query } = require('express');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  if(req.session.auth == 's'){
    res.redirect('/student');
  }
  else if(req.session.auth == 't'){
    res.redirect('/teacher');
  }
  else{
    res.render('main', { message:'', failLogin:''});
  }
});

router.get('/sign_s', function(req, res, next){
  res.render('sign_s', {message:"", wrongPass:''});
});

router.get('/signin_select', function(req, res, next){
  res.render('signin_select');
});

router.get('/sign_t', function(req, res, next){
  res.render('sign_t', {message:"", wrongPass:''});
});

router.get('/emailcheck', function(req, res, next){
  res.render('cerification');
});

// post user listening
router.post('/sign_s', function(req, res, next){
  
  var email = req.body.email;
  var grade = `${req.body.grade}`;
  var cla = req.body.cla;
  var number = req.body.num;
  var password = req.body.password;
  var re_password = req.body.re_password;
  var authNum = Math.random().toString().substr(2, 6);
  var auth = 'false';
  var role = 's';

  var sql = `SELECT email FROM account WHERE email = ?`;
  var values = [email];
  connection.query(sql, values, function(error, result, fields){
    if(error){
      console.log(error);
    }
    else{
      if(result.length > 0){
        res.render('sign_s', {message:"동일한 이메일이 있습니다.", wrongPass:''});
      }
      else if(password != re_password){
        res.render('sign_s', {message:'', wrongPass:'asdf'});
      }
      else{
        sql = `INSERT INTO account(email, grade, class, number, password, auth, role, authNum) VALUES (?,?,?,?,?,?,?,?);`;
        values = [email, grade, cla, number, password, auth, role, authNum];
      
        connection.query(sql, values, function(error, result, fields){
          if(error){
            console.log(error);
          }
          else{
            send(req, res, email, authNum);
            res.render('main', { message:'dsadf', failLogin:'' });
          }
        });
      }
    }
  });
});

router.post('/sign_t', function(req, res, next){
  var email = req.body.email;
  var name = req.body.name;
  var room = req.body.room;
  var cla = req.body.cla;
  var password = req.body.password;
  var re_password = req.body.re_password;
  var authNum = Math.random().toString().substr(2, 6);
  var auth = 'false';
  var role = 't';

  var sql = `SELECT email FROM account WHERE email = ?`;
  var values = [email];
  connection.query(sql, values, function(error, result, fields){
    if(error){
      console.log(error);
    }
    else{
      if(result.length > 0){
        res.render('sign_t', {message:"동일한 이메일이 있습니다.", wrongPass:''});
      }
      else if(password != re_password){
        res.render('sign_t', {message:'', wrongPass:'asdf' });
      }
      else{
        sql = `INSERT INTO account(email, grade, class, number, password, auth, role, authNum) VALUES (?,?,?,?,?,?,?,?);`;
        values = [email, name, cla, room, password, auth, role, authNum];
      
        connection.query(sql, values, function(error, result, fields){
          if(error){
            console.log(error);
          }
          else{
            send(req, res, email, authNum);
            res.render('main', { message:'asdf', failLogin:'' });
          }
        });
      }
    }
  });
});

router.post('/login', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;

  var sql = `SELECT email, password, auth, role FROM account WHERE email = ? AND password = ?;`;
  var value = [email, password];
  connection.query(sql, value, function(error, result, fields){
    if(error){
      console.log(error);
    }
    else{
      try {
        if(result[0]['email'].length > 0 && result[0]['password'].length > 0){
          if(result[0]['auth'] == 'false'){
            res.render('main', { message:'asdf', failLogin:''});
          }
          else if(result[0]['role'] == 's'){ // 세션에 권한 저장
            req.session.auth = 's';
            req.session.email = email;
            res.redirect('/student');
          }
          else if(result[0]['role'] == 't'){
            req.session.auth = 't';
            req.session.email = email;
            res.redirect('/teacher');
          }
        }
        else{
          res.render('main', { message:'', failLogin:'asdf'});
        } 
      } catch (error) {
        res.render('main', {message:'',failLogin:'asdf'});        
      }
    }
  });
});

async function send(req, res, email, authNum){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 456,
    secure: false,
    auth:{
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  var mailOption = await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: req.body.email,
    subject: `회원가입을 위해 인증해주세요`,
    html: `<p style="color:black">회원가입을 위한 이메일인증입니다.</p>
    <p style="color:black">아래의 링크를 클릭해주세요.</p>
    <a href="http://localhost:3000/auth/?email=${email}&token=${authNum}">인증하기</a>`,
  });
  
  transporter.sendMail(mailOption, function(error, info){
    if(error){
      console.log(error);
    }
    console.log('Finish sending email : ' + info.response);

    transporter.close();
  });
}

module.exports = router;
