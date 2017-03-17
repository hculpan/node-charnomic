var express = require('express');
var app = express();

var mysql = require('mysql'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

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
	connection.query('SELECT id, lastname, firstname, turn, onleave from players order by lastname',
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

		send_success(res, {players: players});
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
	connection.query("update players set onleave = 1 where id = ?", [name]),
	function(err, result) {
		console.log("done");
	if (!err) {
		console.log("no error");
		callback(null, result);
	} else
  		console.log("error");
		callback(err, result);
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

function serve_page(req, res) {
	var page = get_page_name(req);

	fs.readFile('basic.html', (err, contents) => {
		if (err) {
			send_failure(res, 500, err);
			return;
		}

		contents = contents.toString('utf8');

		contents = contents.replace('{{PAGE_NAME}}', page);
		res.writeHead(200, { "Content-Type" : "text/html" });
		res.end(contents);

	});
}

function get_page_name(req) {
	return req.params.page_name;
}

function serve_static_file(file, res) {
	var rs = fs.createReadStream(file);

	console.log('serving ' + file);
	rs.on('error', function(e) {
		send_failure(res, 404, invalid_resource());
		return;
	});

	var ct = content_type_for_path(file);
	res.writeHead(200, { "Content-Type": ct });
	rs.pipe(res);
	console.log('done');
}

function content_type_for_path(file) {
	var ext = path.extname(file);
	switch (ext.toLowerCase()) {
		case '.html': return "text/html";
		case '.js': return 'text/javascript';
		case '.css': return 'text/css';
		case '.jpg': case '.jpeg': return 'image/jpeg';
	}
	return "text/plain";
}

/*function handle_get_request(req, res) {
	req.parsed_url = url.parse(req.url, true);
	var core_url = req.parsed_url.pathname;

	if (core_url.substring(0, 9) == '/content/' || core_url.substring(0, 11) == '/templates/') {
		serve_static_file(req.url.substring(1), res);
	} else if (core_url.substr(0, 7) == '/pages/') {
		serve_page(req, res);
	} else if (core_url == "/players") {
		handle_players(req, res);
	} else if (core_url.substr(0, 9) == '/players/' && core_url.length > 9) {
		handle_player(req, res);
	} else if (core_url == "/active") {
		handle_active_players(req, res);
	} else if (core_url == "/monitors") {
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
}*/

function four_oh_four(req, res) {
	send_failure(res, 404, invalid_resource());
}

app.get('/players', handle_players);
app.get('/players/:player', handle_player);
app.get('/active', handle_active_players);
app.get('/monitors', handle_monitor_players);

app.get('/pages/:page_name', serve_page);
app.get('/content/:filename', function(req, res) {
	serve_static_file('content/' + req.params.filename, res);
});
app.get('/templates/:filename', function(req, res) {
	serve_static_file('content/' + req.params.filename, res);
});
app.get('*', four_oh_four);

app.listen(8080);
