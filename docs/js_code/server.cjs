const axios = require("axios");
const http = require("http");
const fs = require("fs");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile("docs/index.html", function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write("Error: File not found");
        } else {
            res.write(data);
        }
        res.end();
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

axios
    .get("http://127.0.0.1:5500/docs/")
    .then((res) => {
        console.log(`statusCode: ${res.status}`);
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });

axios
    .post("http://127.0.0.1:5500/docs/", {
        todo: "Buy the milk"
    })
    .then((res) => {
        console.log(`statusCode: ${res.status}`);
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });
