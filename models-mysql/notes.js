var Notes = undefined;

/**
 * Get the sequelize model
 */
exports.configure = function(inputModel) {
    Notes = inputModel;
}

/**
 * Create a new note
 */
exports.create = function(id, title, body, userId, callback) {
    // Generate a title if title is empty
    if (!title) {
        title = 'Untitled_' + id;
    }

    Note.create({
        id: id,
        title: title,
        body: body,
        userId: userId
    }).then(function(note) {
        callback(null);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get note by note id and user id
 * Return the title and body
 */
exports.read = function(id, userId, callback) {
    Note.find({
        attributes: ['title', 'body'],
        where: {
            id: id,
            userId: userId
        }
    }).then(function(note) {
        if (note) {
            callback(null, note);
        } else {
            callback('Cannot find note ' + id);
        }
    }).error(function(err) {
        callback(err, null);
    });
}

/**
 * Update a note
 * Only the user owning the note can update
 */
exports.update = function(id, title, body, userId, callback) {
    // Generate a title if title is empty
    if (!title) {
        title = 'Untitled_' + id;
    }

    Note.find({
        where: {
            id: id,
            userId: id
        }
    }).then(function(note) {
        if (note) {
            // Update note title and body.
            note.updateAttributes({
                title: title,
                body: body
            }).then(function() {
                callback(null);
            }).error(function(err) {
                callback(err);
            });
        } else {
            callback('Cannot find note ' + id);
        }
    }).error(function(err) {
        callback(err, null);
    });
}

/**
 * Destroy a note
 * Only the user owning the note can destroy
 */
exports.destroy = function(id, userId, callback) {
    Note.destroy({
        where: {
            id: id,
            userId: userId
        }
    }).then(function() {
        callback(null);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get all notes by user
 */
exports.getAll = function(userId, callback) {
    Note.findAll({
        where: {
            userId: userId
        }
    }).then(function(list) {
        callback(null, list);
    }).error(function(err) {
        callback(err, null);
    });
}
