import http from "http";

function startServer() {
  const server = http.createServer((_, res) => {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({ message: "Hello Node World!" }));
  });

  server.listen(3002, () => {
    console.log("Access the page: http://localhost:3002");
  });
}

export default startServer;
