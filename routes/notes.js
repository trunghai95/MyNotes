var models = undefined;

/**
 * Get the database models
 */
exports.configure = function(inputModels) {
    models = inputModels;
}

exports.index = function(req, res, next) {
    models.Notes.getAllTitles(req.user.id, function(err, list) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err,
                user: req.user
            });
        } else {
            res.render('index', {
                title: 'Homepage',
                notes: list,
                user: req.user
            });
        }
    });
}

exports.view = function(req, res, next) {
    var id = req.query.id;

    models.Notes.read(id, req.user.id, function(err, note) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err,
                user: req.user
            });
        } else {
            res.render('noteview', {
                title: note.title,
                note: note,
                id: id,
                user: req.user
            });
        }
    });
}

exports.edit = function(req, res, next) {
    var id = req.query.id;

    models.Notes.read(id, req.user.id, function(err, note) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err,
                user: req.user
            });
        } else {
            res.render('noteedit', {
                title: 'Edit note',
                id: id,
                note: note,
                user: req.user
            });
        }
    });
}

exports.add = function(req, res, next) {
    res.render('noteedit', {
        title: 'Add note',
        id: '',
        note: null,
        user: req.user
    });
}

exports.save = function(req, res, next) {
    var id = req.body.id;

    if (!id) {
        models.Notes.create(req.body.title, req.body.body, req.user.id, function(err, note) {
            if (err) {
                res.render('showerror', {
                    title: 'Error',
                    error: err,
                    user: req.user
                });
            } else {
                res.redirect('/noteview?id=' + note.id);
            }
        });
    } else {
        models.Notes.update(id, req.body.title, req.body.body, req.user.id, function(err) {
            if (err) {
                res.render('showerror', {
                    title: 'Error',
                    error: err,
                    user: req.user
                });
            } else {
                res.redirect('/noteview?id=' + id);
            }
        });
    }
}

exports.delete = function(req, res, next) {
    var id = req.query.id;

    models.Notes.read(id, req.user.id, function(err, note) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err,
                user: req.user
            });
        } else {
            res.render('notedelete', {
                title: 'Delete note',
                id: id,
                note: note,
                user: req.user
            });
        }
    })
}

exports.destroy = function(req, res, next) {
    var id = req.body.id;

    models.Notes.destroy(id, req.user.id, function(err) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err,
                user: req.user
            });
        } else {
            res.redirect('/');
        }
    });
}
