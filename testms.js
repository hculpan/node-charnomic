var mysql      = require('mysql');
var pword;

process.argv.forEach((val, index) => {
  if (val.startsWith('password=')) {
  	pword = val.substr(9);
  	console.log(`Got password ${pword}`);
  }
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : pword,
  database : 'charnomic'
});

connection.connect();

connection.query('SELECT * from players', function(err, rows, fields) {
  if (!err) {
  	console.log('The solution is: ', rows);
  } else
    console.log('Error while performing Query.');
});

connection.end();
