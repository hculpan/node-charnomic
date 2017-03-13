var http = require('http'),
	mysql      = require('mysql');

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
	connection.query('SELECT * from players order by lastname',
		function(err, rows, fields) {
	  if (!err) {
	  	callback(null, rows);
	  } else
	    callback(err);
	});
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

function send_success(res, data) {
	res.writeHead(200, {"Content-Type": "application/json"});
	var output = { error: null, data: data };
	res.end(JSON.stringify(output) + "\n");
}

function make_error(err, msg) {
	var e = new Error(msg);
	e.code = err;
	return e;
}

function invalid_resource() {
	return make_error("invalid_resource", "The request url does not exist");
}

function send_failure(res, server_code, err) {
	var code = (err.code) ? err.code : err.name;
	res.writeHead(server_code, { "Content-Type": "application/json"});
	res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}

function handle_players(req, res) {
	load_players((err, players) => {
		if (err) {
			send_failure(res, 500, err);
			return;
		}

		send_success(res, players);
	});
}

function handle_active_players(req, res) {
	load_active_players((err, players) => {
		if (err) {
			send_failure(res, 500, err);
			return;
		}

		send_success(res, players);
	});
}

function handle_monitor_players(req, res) {
	load_monitors((err, players) => {
		if (err) {
			send_failure(res, 500, err);
			return;
		}

		send_success(res, players);
	});
}

function handle_incoming_request(req, res) {
	console.log("Incoming request: " + req.method + " " + req.url);
	if (req.url == "/players") {
		handle_players(req, res);
	} else if (req.url == "/active") {
		handle_active_players(req, res);
	} else if (req.url == "/monitors") {
		handle_monitor_players(req, res);
	} else {
		send_failure(res, 404, invalid_resource());
	}
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);
