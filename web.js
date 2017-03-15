var http = require('http');

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

function handle_player(req, res) {
	var player = req.url.substr(9);
	load_player(player, (err, players) => {
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

function update_onleave(name, callback) {
	console.log(`updating onleave, name = ${name}`);
	connection.query("update players set onleave = 1 where lower(lastname) = ?", [name.toLowerCase()]),
	function(err, result) {
		console.log("done");
	if (!err) {
		console.log("no error");
		callback(null, result);
	} else
  	console.log("error");
		callback(err);
	}
}

function handle_player_onleave(name, req, res) {
	update_onleave(name, (err, result) => {
		if (err) {
			send_failure(res, 500, err);
			return;
		}

		send_success(res, result);
	});
}

function handle_get_request(req, res) {
	if (req.url == "/players") {
		handle_players(req, res);
	} else if (req.url.substr(0, 9) == '/players/' && req.url.length > 9) {
		handle_player(req, res);
	} else if (req.url == "/active") {
		handle_active_players(req, res);
	} else if (req.url == "/monitors") {
		handle_monitor_players(req, res);
	} else {
		send_failure(res, 404, invalid_resource());
	}
}

function handle_post_request(req, res) {
	if (req.url.toLowerCase().startsWith('/players/') && req.url.toLowerCase().endsWith("/on-leave")) {
		var pos = req.url.toLowerCase().indexOf("/on-leave");
		var pname = req.url.substr(9, pos - 9);
		handle_player_onleave(pname);
	}
}

function handle_incoming_request(req, res) {
	console.log("Incoming request: " + req.method + " " + req.url);
	if (req.method.toLowerCase() == 'get') {
		handle_get_request(req, res);
	} else if (req.method.toLowerCase() == 'post') {
		handle_post_request(req, res);
	} else {
		send_failure(res, 404, invalid_resource());
	}
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);
