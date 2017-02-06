var Users = undefined;

/**
 * Get the sequelize model
 */
exports.configure = function(inputModel) {
    Users = inputModel;
}

/**
 * Generate userId from username
 */
function generateId(username) {
    return username;
}

/**
 * Create a new user
 */
exports.create = function(username, password, email, callback) {
    // Generate id for user
    var id = generateId(username);

    Users.create({
        id: id,
        username: username,
        password: password,
        email: email
    }).then(function(user) {
        callback(null);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Find user by userId
 */
exports.findById = function(id, callback) {
    Users.find({
        where: { id: id }
    }).then(function(user) {
        if (user) {
            callback(null, {
                id: user.id,
                username: user.username,
                password: user.password,
                email: user.email
            });
        } else {
            // Cannot find the user
            callback('Cannot find user ' + id);
        }
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Find user by username
 */
exports.findByUsername = function(username, callback) {
    Users.find({
        where: { username: username }
    }).then(function(user) {
        if (user) {
            callback(null, {
                id: user.id,
                username: user.username,
                password: user.password,
                email: user.email
            });
        } else {
            // Cannot find the user
            callback('Cannot find user ' + username);
        }
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Update a user
 */
exports.update = function(id, username, password, email, callback) {
    var newUser = {};
    if (username) {
        newUser.username = username;
    }
    if (password) {
        newUser.password = password;
    }
    if (email) {
        newUser.email = email;
    }

    Users.find({
        where: { id: id }
    }).then(function(user) {
        if (user) {
            user.updateAttributes(newUser).then(function() {
                callback();
            }).error(function(err) {
                callback(err);
            });
        } else {
            callback('Cannot find user ' + id);
        }
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Destroy a user
 */
exports.destroy = function(id, callback) {
    Notes.destroy({
        where: { id: id }
    }).then(function() {
        callback(null);
    }).error(function(err) {
        callback(err);
    });
}
