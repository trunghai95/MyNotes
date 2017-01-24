var model = undefined;

exports.configure = function(model_input) {
    model = model_input;
}

exports.index = function(req, res, next) {
    model.getAll(function(err, list) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err
            });
        } else {
            res.render('index', {
                title: 'Homepage',
                notes: list
            });
        }
    });
};

exports.view = function(req, res, next) {
    var id = req.query.id;

    model.get(id, function(err, note) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err
            });
        } else {
            res.render('noteview', {
                title: note.title,
                note: note,
                id: id
            });
        }
    });
}

exports.edit = function(req, res, next) {
    var id = req.query.id;

    model.get(id, function(err, note) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err
            });
        } else {
            res.render('noteedit', {
                title: 'Edit note',
                id: id,
                note: note
            });
        }
    });
}

exports.add = function(req, res, next) {
    res.render('noteedit', {
        title: 'Add note',
        id: '',
        note: null
    });
}

exports.save = function(req, res, next) {
    var id = req.body.id;

    if (!id) {
        id = String(Date.now());
        model.insert(id, req.body.title, req.body.body, function(err) {
            if (err) {
                res.render('showerror', {
                    title: 'Error',
                    error: err
                });
            } else {
                res.redirect('/noteview?id=' + id);
            }
        });
    } else {
        model.update(id, req.body.title, req.body.body, function(err) {
            if (err) {
                res.render('showerror', {
                    title: 'Error',
                    error: err
                });
            } else {
                res.redirect('/noteview?id=' + id);
            }
        });
    }
}

exports.delete = function(req, res, next) {
    var id = req.query.id;

    model.get(id, function(err, note) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err
            });
        } else {
            res.render('notedelete', {
                title: 'Delete note',
                id: id,
                note: note
            });
        }
    })
}

exports.destroy = function(req, res, next) {
    var id = req.body.id;

    model.delete(id, function(err) {
        if (err) {
            res.render('showerror', {
                title: 'Error',
                error: err
            });
        } else {
            res.redirect('/');
        }
    });
}
