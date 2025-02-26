const http = require("http");

const PORT = 9000;

const server = http.createServer((req, res) => {
    if (req.url === "/api") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Welcome to the API", status: "success" }));
    } else if (req.url === "/index") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<html><body><h1>Welcome to the Index Page</h1></body></html>");
    } else if (req.url === "/text"
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("This is a plain text response.");
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
