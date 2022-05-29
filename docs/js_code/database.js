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
async function main() {
    const highscores = await db.all("SELECT * FROM highscores");
    console.log(highscores);
    await db.close();
}

window.onload = function init() {
    main();
};