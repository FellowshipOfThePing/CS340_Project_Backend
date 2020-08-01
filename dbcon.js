
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_binderje',
  password        : '4788',
  database        : 'cs340_binderje'
});

module.exports.pool = pool;