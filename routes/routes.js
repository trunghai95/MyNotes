var router = require('express').Router();
var notes = require('./notes');
var users = require('./users');
var passport = undefined;

// Methods for configuring passport
exports.serializeUser = users.serialize;
exports.deserializeUser = users.deserialize;
exports.loginStrategy = users.loginStrategy;
exports.registerStrategy = users.registerStrategy;

/**
 * Get the database models
 */
exports.configure = function(params) {
    // Passing models to sub-routes
    notes.configure(params.models);
    users.configure(params.models);

    // Get passport object
    passport = params.passport;
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
    router.post('/register', passport.authenticate('local-register', {
        successRedirect: '/registerDone',
        failureRedirect: '/register',
        failureFlash: true
    }));
}

// Router methods
router.get('/', users.ensureAuthenticated, notes.index);
router.get('/noteview', users.ensureAuthenticated, notes.view);
router.get('/noteedit', users.ensureAuthenticated, notes.edit);
router.get('/noteadd', users.ensureAuthenticated, notes.add);
router.post('/notesave', users.ensureAuthenticated, notes.save);
router.get('/notedelete', users.ensureAuthenticated, notes.delete);
router.post('/notedestroy', users.ensureAuthenticated, notes.destroy);
router.get('/account', users.ensureAuthenticated, users.viewAccount);
router.get('/login', users.login);
router.get('/logout', users.logout);
router.get('/register', users.register);
router.get('/registerDone', users.registerDone);

exports.router = router;
