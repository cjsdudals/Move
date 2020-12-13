var express = require('express');
var router = express.Router();
var check = require('../models/check');
var connection = require('../models/db');
require('dotenv').config();

router.get('/', function(req, res, next){
  if(req.session.auth == 't'){
    res.render('start_t');
  }
  else{
    res.redirect('/');
  }
});
  
router.get('/check', function(req, res, next){
  var sql = `SELECT * FROM application WHERE idx != 1 AND certify = 'false';`;
  connection.query(sql, function(error, result, fields){
    if(error){
      console.log(error);
    }
    else{
      var name = [], grade = [], people = [], time = [], reason = [], room = [], represent = [];
      console.log(result.length);
      if(result.length === 0){
        res.render('check', {
          name:[['OOO'], ['OOO'],['OOO'],['OOO']],
          grade:[['0-0-00'], ['0-0-00'], ['0-0-20'], ['0-0-00']],
          represent:['OOO', 'OOO', 'OOO', 'OOO'],
          people:['1', '1', '1', '1'],
          time:['4', '4', '4', '4'],
          reason:['OOOO', 'OOOO','OOOO','OOOO'],
          room:['O-O', 'O-O', 'O-O', 'O-O']});
        return;
      }
      else if(result.length < 4){
        var max_length = result.length;
      }
      else{
        var max_length = 4;
      }
      for(var i = 0;i < max_length; i ++){
        var gra = "";
        name.push(result[i]['name'].split(','));
        var g = result[i]['grade'].split(',');
        var c = result[i]['class'].split(',');
        var n = result[i]['number'].split(',');
        people.push(result[i]['person']);
        represent.push(name[i][0]);
        time.push(result[i]['time']);
        reason.push(result[i]['reason']);
        room.push(result[i]['room']);
        for (let i = 0; i < g.length; i++) {
          gra += `${g[i]}-${c[i]}-${n[i]},`;
        }
        grade.push(gra.split(','));
      }
      for(var j = 0;j <= 4;j++){
        name.push(['OOO']);
        grade.push(['O-O-OO']);
        people.push('O');
        represent.push('OOO');
        time.push('O');
        reason.push('OOO');
        room.push('O');
      }
      res.render('check', {
        name:name,
        grade:grade,
        represent:represent,
        people:people,
        time:time,
        reason:reason,
        room:room
      })
    }
  });
});
  
router.get('/class', function(req, res, next){
  res.render('class', {total:'20', now:'20'});
});

router.post('/check', function(req, res, next){
  var certify = req.body.certify.split(',');
  var sql = `SELECT idx FROM application WHERE certify = 'false' AND idx != 1;`;
  connection.query(sql, function(error, result, fields){
    try {
      if(error){
        console.log(error);
        res.redirect('/');
      }
      else if(certify[1] == 'true'){
        sql = `UPDATE application SET certify = 'true' WHERE idx = ${result[parseInt(certify[0]-1, 10)]['idx']};`;
      }
      else if(certify[1] == 'false'){
        sql = `UPDATE application SET certify = 'rejected' WHERE idx = ${result[parseInt(certify[0]-1, 10)]['idx']};`;
      }
      connection.query(sql, function(error, result, fields){
        if(error){
          console.log(error);
        }
        else{
          res.redirect('/');
        }
      });  
    } catch (error) {
      res.redirect('/');
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

module.exports = router;
