const http = require("http");

const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(JSON.stringify({ message: "Hello Node World!" }));
});

function startServer() {
  server.listen(3001, () => {
    console.log("Access the page: http://localhost:3001");
  });
}

module.exports = startServer;
