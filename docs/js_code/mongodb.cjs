const mongodb = require("mongodb");

const mongoUrl = "mongodb://localhost:27017";
const mongoClient = new mongodb.MongoClient(mongoUrl);

async function main(id, score, name) {
    await mongoClient.connect();
    const db = mongoClient.db("highscores");
    const highscoreCollection = db.collection("highscore");

    const newHighscore = {
        id: id,
        score: score,
        name: name
    };
    await highscoreCollection.insertOne(newHighscore);
    const scores = await highscoreCollection.find({ id: 0 }).toArray();
    console.log(scores);
    await mongoClient.close();
}

main();