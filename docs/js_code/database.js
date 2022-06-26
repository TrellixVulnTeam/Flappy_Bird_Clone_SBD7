/* eslint-disable max-len */
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

// Database
const dbFilePath = "docs/database/highscores.db";
const db = await sqlite.open({
    filename: dbFilePath,
    driver: sqlite3.Database
});

// ****************************                  Database functions                         **************************** //
function main() {
    const highscores = db.all("SELECT * FROM highscores");
    console.log(highscores);
    db.close();
}

window.onload = function init() {
    main();
};