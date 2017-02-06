var Notes = undefined;

/**
 * Get the sequelize model
 */
exports.configure = function(inputModel) {
    Notes = inputModel;
}

/**
 * Generate note id
 */
function generateId() {
    return String(Date.now());
}

/**
 * Create a new note
 * Return id of the new note
 */
exports.create = function(title, body, userId, callback) {
    // Generate note id
    var id = generateId();

    // Generate a title if title is empty
    if (!title) {
        title = 'Untitled_' + id;
    }

    Notes.create({
        id: id,
        title: title,
        body: body,
        userId: userId
    }).then(function(note) {
        callback(null, id);
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get note by note id and user id
 * Return the title and body
 */
exports.read = function(id, userId, callback) {
    Notes.find({
        where: {
            id: id,
            userId: userId
        }
    }).then(function(note) {
        if (note) {
            callback(null, {
                title: note.title,
                body: note.body
            });
        } else {
            callback('Cannot find note ' + id);
        }
    }).error(function(err) {
        callback(err);
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

    Notes.find({
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
                callback();
            }).error(function(err) {
                callback(err);
            });
        } else {
            callback('Cannot find note ' + id);
        }
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Destroy a note
 * Only the user owning the note can destroy
 */
exports.destroy = function(id, userId, callback) {
    Notes.destroy({
        where: {
            id: id,
            userId: userId
        }
    }).then(function() {
        callback();
    }).error(function(err) {
        callback(err);
    });
}

/**
 * Get all note titles by user
 */
exports.getAllTitles = function(userId, callback) {
    Notes.findAll({
        where: {
            userId: userId
        }
    }).then(function(notes) {
        var result = [];
        notes.forEach(function(note) {
            result.push({
                id: note.id,
                title: note.title,
            });
        });

        callback(null, notes);
    }).error(function(err) {
        callback(err);
    });
}
