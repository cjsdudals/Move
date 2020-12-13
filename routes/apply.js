var express = require('express');
var router = express.Router();
var model = require('../models/check');
var connection = require('../models/db');
var moment = require('moment-timezone');
var time = require('../models/date');
var room = require('../models/room.json');
const { connect } = require('../models/db');
const { min } = require('moment-timezone');
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    console.log(time.time());
});

router.post('/', function(req, res, next){
  var today = time.time();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var hour = today.getHours();
  var minute = today.getMinutes();
  var second = today.getSeconds();

  //대표 한명 저장
    var sql = `INSERT INTO application(idx, grade, name, floor, room, date, time) VALUES (?,?,?,?,?,?,?);`;
    var values = [req.body.idx, req.body.rep_grade, req.body.rep_name, room[req.body.room][0], room[req.body.room][1],`${year}-${month}-${date}`, `${hour}:${minute}:${second}`]; // room 따로 json 객체 만들어서 가져오기
    console.log(room[req.body.room]);

    connection.query(sql, values, function(error, result, fields){
      if(error){
        console.log(error);
      }
    });
});

router.get('/commit', function(req, res, next){
    var today = time.time();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    var using = [];

    var sql = `SELECT * FROM application WHERE date = '${year}-${month}-${date}';`;
    connection.query(sql, function(error, results, fields){
      if (error){
        console.log(error);
      }
      else{
        for(var i = 0;i < results.length;i++){
          using.push(`${results[i]['floor']}-${results[i]['room']}`);
        }
        console.log(using);
        res.send(using);
      }
    });
});

module.exports = router;
