var mysql  = require('mysql');

var pword = null;

process.argv.forEach((val, index) => {
  if (val.startsWith('password=')) {
  	pword = val.substr(9);
  }
});

if (pword == null) {
	console.log("Error: Must pass in MySql password as parameter 'password=<password>");
	return;
}

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : pword,
  database : 'charnomic'
});

connection.connect();

function load_players(callback) {
	connection.query('SELECT id, lastname, firstname from players order by lastname',
		function(err, rows, fields) {
	  if (!err) {
	  	callback(null, rows);
	  } else
	    callback(err);
	});
}

function load_player(player_name, callback) {
	if (isNaN(player_name)) {
		connection.query("SELECT * from players where lower(lastname) = lower('" + player_name + "') order by lastname",
		function(err, rows, fields) {
		  if (!err) {
		  	callback(null, rows);
		  } else
		    callback(err);
		});
	} else {
		connection.query("SELECT * from players where id = " + player_name + " order by lastname",
		function(err, rows, fields) {
		  if (!err) {
		  	callback(null, rows);
		  } else
		    callback(err);
		});
	}
}

function load_active_players(callback) {
	connection.query('SELECT * from players order by lastname',
		function(err, rows, fields) {
	  if (!err) {
	  	var active_players = [];

	  	for (var i = 0; i < rows.length; i++) {
	  		if (rows[i].onleave == 0) {
	  			active_players.push(rows[i]);
	  		}
	  	}

	  	callback(null, active_players);
	  } else
	    callback(err);
	});
}

function load_monitors(callback) {
	connection.query('SELECT * from players where monitor = 1 order by lastname',
		function(err, rows, fields) {
	  if (!err) {
	  	callback(null, rows);
	  } else
	    callback(err);
	});
}

