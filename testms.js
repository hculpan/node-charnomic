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

var name = 'Wiegand';
connection.query("update players set onleave = 1 where lower(lastname) = ?", [name.toLowerCase()], function(err, result) {
  console.log("done");
  if (!err) {
  	console.log('The solution is: ', result);
  } else
    console.log('Error while performing Query.');
});

connection.end();
