# Notes

- A simple web application for noting, based on the [Node.js tutorial on PhoCode](http://phocode.com/javascript/nodejs-lap-trinh-web-voi-node-js/) (Vietnamese).
- Built on __Node.js__ (using __Express.js__ framework).
- __SQLite3__, __MongoDB__ or __MySQL__ for database.

## Screenshots
![Index](./screenshots/index.png)
*Index page*

![Add note](./screenshots/noteadd.png)
*Adding a new note*

![View note](./screenshots/noteview.png)
*Viewing a note*

![Index2](./screenshots/index2.png)
*Index page after adding the note*

![Delete note](./screenshots/notedelete.png)
*Deleting a note*

## Changelog 29/01/2017

- Refine source code (a little bit!).
- Add __MySQL__ for database.
- Can choose between SQLite3 and MongoDB by setting the `database` field in *config.json*
  - `sqlite3` for SQLite3
  - `mongodb` for MongoDB
  - `mysql` for MySQL
- Fix noteview (multiline notes are now really multiline!).
- Add demo screenshots.

## Changelog 27/01/2017

- Add __MongoDB__ for database.
- Can choose between SQLite3 and MongoDB by setting the `database` field in *config.json* (`sqlite3` for SQLite3 and `mongodb` for MongoDB).
