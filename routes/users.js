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
 * Strategy to check username and password when logging in
 */
exports.loginStrategy = new LocalStrategy(function(username, password, callback) {
    // NextTick for doing job asynchronously
    process.nextTick(function() {
        models.Users.findByUsername(username, function(err, user) {
            if (err) {
                return callback(err);
            }

            if (!user) {
                // Cannot find user
                return callback(null, false, { message: 'Invalid username or password' });
            } else if (password != user.password) {
                // Wrong password
                return callback(null, false, { message: 'Invalid username or password' });
            }

            return callback(null, user);
        });
    });
});

/**
 * Strategy to register new user
 * passReqToCallback field to get the req param
 */
exports.registerStrategy = new LocalStrategy({ passReqToCallback: true }, function(req, username, password, callback) {
    // NextTick for doing job asynchronously
    process.nextTick(function() {
        models.Users.findByUsername(username, function(err, user) {
            if (err) {
                return callback(err);
            }

            if (user) {
                // Somebody took that username
                return callback(null, false, { message: 'Username not available. Please try another username.' });
            } else if (password != req.body.confirmPassword) {
                // Passwords do not match
                return callback(null, false, { message: 'Passwords do not match. Please try again.'})
            }

            // Check the email
            models.Users.findByEmail(req.body.email, function(err, user) {
                if (err) {
                    return callback(err);
                }

                if (user) {
                    // Somebody took that email
                    return callback(null, false, { message: 'Email not available. Please try another email.' });
                }

                // Register successfully
                models.Users.create(username, password, req.body.email, function(err, user) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, user);
                });
            });
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

exports.register = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('register', {
        title: 'Register',
        user: req.user,
        message: req.flash('error')
    });
}

exports.registerDone = function(req, res, next) {
    res.render('registerDone', {
        title: 'Successfully registered',
        user: req.user
    });
}
