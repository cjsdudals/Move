var express = require('express');
var router = express.Router();
var connection = require('../models/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

router.get('/auth', function(req, res, next){
  // res.render('');
  
  var email = req.query.email;
  var token = req.query.token;

  var sql = `SELECT authNum FROM account WHERE email="${email}"`;
  connection.query(sql, function(error, result, fields){
    if(error){
      console.log(error);
    }
    else{
      sql = `UPDATE account SET auth='true' WHERE email="${email}"`;
      connection.query(sql, function(error, result, fields){
        if(error){
          console.log(error);
        }
        else{
          res.send(`<div>인증이 완료되었습니다.</div>
          <a href="/">로그인 화면으로 돌아가기</a>`);
        }
      });
    }
  });

});

module.exports = router;
