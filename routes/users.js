var LocalStrategy = require('passport-local').Strategy;
var models = undefined;

/**
 * Get the database models
 */
exports.configure = function(inputModels) {
    models = inputModels;
}

exports.serialize = function(user, callback) {
    callback(null, user.id);
}

exports.deserialize = function(id, callback) {
    models.Users.findById(id, callback);
}

/**
 * Strategy to check username and password
 */
exports.strategy = new LocalStrategy(function(username, password, callback) {
    // NextTick for doing job asynchronously
    process.nextTick(function() {
        models.Users.findByUsername(username, function(err, user) {
            if (err) {
                return callback(err);
            }

            if (user) {
                if (password == user.password) {
                    return callback(null, user);
                } else {
                    // Wrong password
                    return callback(null, false, {
                        message: 'Wrong password'
                    });
                }
            } else {
                // Cannot find user
                return callback(null, false, {
                    message: 'Invalid username'
                });
            }
        });
    });
});

/**
 * Check whether the user is logged in or not
 */
exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

exports.viewAccount = function(req, res, next) {
    res.render('account', {
        title: req.user.username,
        user: req.user
    });
}

exports.login = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('login', {
        title: 'Login',
        user: req.user,
        message: req.flash('error')
    });
}

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/login');
}
