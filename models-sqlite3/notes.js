var path = require('path');
var sqlite3 = require('sqlite3');
sqlite3.verbose();
var db = undefined;

const DB_NAME = 'db.sqlite3';

exports.connect = function(config, callback) {
    db = new sqlite3.Database(path.join(__dirname, config.sqlite3_db_name), 
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
        callback);
}

exports.disconnect = function(callback) {
    callback();
}

exports.insert = function(id, title, body, callback) {
    if (!title) {
        title = 'Untitled_' + id;
    }

    db.run(`INSERT INTO notes(id, title, body) VALUES (?, ?, ?);`, 
        [id, title, body],
        callback);
}

exports.update = function(id, title, body, callback) {
    if (!title) {
        title = 'Untitled_' + id;
    }

    db.run(`UPDATE notes SET title = ?, body = ? WHERE id = ?;`,
        [title, body, id],
        callback);
}

exports.get = function(id, callback) {
    db.get(`SELECT title, body FROM notes WHERE id = ?;`,
        [id],
        function(err, row) {
            if (err) {
                callback(err, null);
            } else if (!row) {
                callback("Cannot find note " + id, null);
            } else {
                callback(null, row);
            }
        });
}

exports.delete = function(id, callback) {
    db.run(`DELETE FROM notes WHERE id = ?;`,
        [id],
        callback);
}

exports.getAll = function(callback) {
    var res = [];

    db.each(`SELECT * FROM notes`,
        function(err, row) {
            if (err) {
                callback(err, null);
            } else {
                res.push(row);
            }
        }, function(err, num) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
}
