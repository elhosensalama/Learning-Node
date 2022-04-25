let fs = require("fs");
const http = require("http");
const url = require("url");
const sayHello = require("./modules/sayHelloModel");

sayHello("ahmed");
// Server
const tourData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const Server = http.createServer((req, res) => {
    const pathName = req.url;
    const { pathname, query } = url.parse(req.url);
    console.log(pathname, query);
    if (pathName == "/" || pathName == "/overview") {
        res.end("This is overview !");
    } else if (pathName == "/products") {
        res.end("This is products !");
    } else if (pathName == "/api") {
        res.writeHead(200, {
            "content-type": "application/json",
        });
        res.end(tourData);
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html",
            "My-Own-Header": "hello-from-nodejs",
        });
        res.end("<h1>Page not found !</h1>");
    }
});

Server.listen("8000", "localhost", () => {
    console.log("Listening on port 8000!");
});
