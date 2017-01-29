var Sequelize = require('sequelize');
var Note = undefined

exports.connect = function(config, callback) {
    var sqlz = new Sequelize(config.mysql_db_uri, { logging: false });
    Note = sqlz.define('Note', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        title: Sequelize.STRING,
        body: Sequelize.TEXT
    });

    Note.sync().then(function() {
        callback(null);
    }).error(function(err) {
        callback(err);
    })
}

exports.disconnect = function(callback) {
    callback();
}

exports.insert = function(id, title, body, callback) {
    if (!title) {
        title = 'Untitled_' + id;
    }

    Note.create({
        id: id,
        title: title,
        body: body
    }).then(function(note) {
        callback(null);
    }).error(function(err) {
        callback(err);
    });
}

exports.get = function(id, callback) {
    Note.find({
        where: { id: id }
    }).then(function(note) {
        if (note) {
            callback(null, note);
        } else {
            callback('Cannot find id ' + id);
        }
    }).error(function(err) {
        callback(err, null);
    });
}

exports.update = function(id, title, body, callback) {
    if (!title) {
        title = 'Untitled_' + id;
    }

    Note.find({
        where: { id: id }
    }).then(function(note) {
        if (note) {
            note.updateAttributes({
                title: title,
                body: body
            }).then(function() {
                callback(null);
            }).error(function(err) {
                callback(err);
            });
        } else {
            callback('Cannot find id ' + id);
        }
    }).error(function(err) {
        callback(err, null);
    });
}

exports.delete = function(id, callback) {
    Note.find({
        where: { id: id }
    }).then(function(note) {
        note.destroy().then(function() {
            callback(null);
        }).error(function(err) {
            callback(err);
        });
    });
}

exports.getAll = function(callback) {
    Note.findAll().then(function(list) {
        callback(null, list);
    }).error(function(err) {
        callback(err, null);
    });
}
