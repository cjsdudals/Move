var express = require('express');
var router = express.Router();
var check = require('../models/check');
var connection = require('../models/db');
require('dotenv').config();

router.get('/', function(req, res, next){
  console.log(req.session);
  if(req.session.auth == 's'){
    res.render('start_s');
  }
  else{
    res.redirect('/');
  }
});
  
router.get('/putin', function(req, res, next){
  res.render('putin', {message:''});
});
  
router.get('/class', function(req, res, next){
  var sql = `SELECT COUNT(grade), class, grade FROM students WHERE class = (SELECT class FROM account WHERE email = '${req.session.email}') AND grade = (SELECT grade FROM account WHERE email = '${req.session.email}');`;
  connection.query(sql, function(error, result, fields){
    if(error){
      res.render('class', {total:'20', now:'20'});
    }
    else{
      total_num = result[0]['COUNT(grade)'];
      var date = new Date();
      var classOf = [`${result[0]['grade']}`, `${result[0]['class']}`];
      sql = `SELECT grade, class FROM application WHERE date = '${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}' AND certify = 'true';`;
      connection.query(sql, function(error, result, fields){
        if(error){
          res.render('class', {total: total_num, now: total_num});
        }
        else{
          try {
            var now_num = total_num;
            for(var i = 0; i < result.length; i++){
              var cla = result[i]['class'].split(',');
              var grade = result[i]['grade'].split(',');
              console.log(grade);
              for(var j = 0;j < cla.length; j++){
                console.log(classOf[0]+grade[j]);
                if(classOf[0] == grade[j] && classOf[1] == cla[j]){
                  now_num -= 1;
                  console.log(now_num);
                }
              }
            }
            res.render('class', {total: total_num, now: now_num});
          } catch (error) {
            res.render('class', {total: total_num, now: total_num});
          }
        }
      });
    }
  });
});

router.post('/', function(req, res, next){
  //세션 초기화
  req.session.destroy(function(error){
    if(error){
      console.log('fail to delete');
      return;
    }
    console.log(req.session);
    res.redirect('/users/login');
  });
});

router.post('/putin', function(req, res, next){
  var person = req.body.person;
  var name = req.body.name;
  var grade = req.body.grade;
  var cla = req.body.cla;
  var num = req.body.num;
  var room = req.body.room;
  var s_time = `${req.body.s_hour}:${req.body.s_min}`;
  var e_time = `${req.body.e_hour}:${req.body.e_min}`;
  var reason = req.body.reason;
  var idx = 1;
  var date = new Date();

  var sql = `SELECT date, room FROM application WHERE date = '${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}' AND room = '${room}';`;
  connection.query(sql, function(error, result, fields){
    console.log(result);
    if(error){
      console.log(error);
    }
    else if(result[0] == null){
      var sql = `SELECT idx FROM application WHERE idx = (SELECT MAX(idx) FROM application);`;
      connection.query(sql, function(error, result, fields){
        console.log(result);
        if(error){
          console.log(error);
        }
        else{
          idx = result[0]['idx'] + 1;
          sql = `INSERT INTO application(idx, grade, class, number, name, room, date, time, person, reason, certify) VALUES(?,?,?,?,?,?,?,?,?,?,?);`;
          var values = [idx, `${grade}`, `${cla}`, `${num}`, `${name}`, room, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, `${s_time}~${e_time}`, person, reason, 'false'];
          connection.query(sql, values, function(error, result, fields){
            if(error){
            console.log(error);
            }
            else{
              res.redirect('/student');
            }
          });
        }
      });
    }
    else if(result[0]['date'] == `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` && result[0]['room'] == room){
      res.render('putin', {message:'해당 실을 신청할 수 없습니다.'});
    }
  });
});

module.exports = router;
