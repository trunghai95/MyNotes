var workforce = require('workforce');
var manager = workforce('../app.js');
var config = require('../config');
var debug = require('debug')('notes:server');

var port = process.env.PORT || 3000;

/**
 * Configure workforce manager
 */
manager.set('workers', config.cpu_core_num)
    .set('title', 'MyNotes')
    .set('restart threshold', '10s')
    .set('exit timeout', '5s')
    .listen(port)
    .on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    debug('Listening on port ' + port);
}
