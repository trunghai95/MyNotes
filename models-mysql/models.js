var Sequelize = require('sequelize');
var notes = require('./notes');
var users = require('./users');
var config = require('../config');

/**
 * Connect to the database and define the models.
 */
exports.connect = function(callback) {
    var sqlz = new Sequelize(config.mysql_db_uri, { logging: false });

    var Users = sqlz.define('User', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        }
    });

    Users.sync().then(function() {
        users.configure(Users);
        exports.Users = users;

        // Create Notes model after finish creating Users
        var Notes = sqlz.define('Note', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            title: Sequelize.STRING() + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            body: Sequelize.TEXT() + ' CHARSET utf8 COLLATE utf8_unicode_ci'
        });

        // Create relationship.
        // ON DELETE CASCADE --> If a user is deleted, the notes referencing to 
        // that user will also be deleted.
        Notes.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });

        Notes.sync().then(function() {
            notes.configure(Notes);
            exports.Notes = notes;

            callback();
        }).error(function(err) {
            callback(err);
        });
    }).error(function(err) {
        callback(err);
    });
}
